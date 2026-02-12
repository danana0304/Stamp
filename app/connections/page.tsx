"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserProfile {
  id: string;
  username: string;
  location: string;
  isFriendRequested: boolean;
}

export default function ConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<
    Array<{
      id: string;
      username: string;
      location: string;
      connectionId: string;
    }>
  >([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const supabase = createClient();

  // Get current user on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        fetchPendingRequests(user.id);
      }
    };
    getUser();
  }, []);

  const fetchPendingRequests = async (userId: string) => {
    setPendingLoading(true);
    try {
      const { data, error } = await supabase
        .from("connections")
        .select("id, sender_id, profiles!sender_id(id, username, location)")
        .eq("receiver_id", userId)
        .eq("status", "pending");

      if (error) throw error;

      const formatted = data.map((conn: any) => ({
        id: conn.profiles.id,
        username: conn.profiles.username,
        location: conn.profiles.location,
        connectionId: conn.id,
      }));
      setPendingRequests(formatted);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    } finally {
      setPendingLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !currentUserId) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      // First, get all profiles matching the search
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, location")
        .ilike("username", `%${searchQuery}%`)
        .neq("id", currentUserId);

      console.log("Profiles response:", { profiles, profileError });

      if (profileError) throw profileError;

      if (!profiles || profiles.length === 0) {
        console.log("No profiles found");
        setSearchResults([]);
        setLoading(false);
        return;
      }

      // Then, check which ones have pending requests from current user
      const { data: connections, error: connError } = await supabase
        .from("connections")
        .select("receiver_id")
        .eq("sender_id", currentUserId)
        .eq("status", "pending");

      console.log("Connections response:", { connections, connError });

      if (connError) throw connError;

      const requestedUserIds = new Set(
        connections?.map((c: any) => c.receiver_id) || [],
      );

      // Transform data to match your UserProfile interface
      const formattedResults = profiles.map((profile: any) => ({
        id: profile.id,
        username: profile.username,
        location: profile.location,
        isFriendRequested: requestedUserIds.has(profile.id),
      }));

      console.log("Formatted results:", formattedResults);
      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async (targetUserId: string) => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase.from("connections").insert({
        sender_id: currentUserId,
        receiver_id: targetUserId,
        status: "pending",
      });

      if (!error) {
        setFriendRequests((prev) => new Set([...prev, targetUserId]));
      } else {
        console.error("Error sending request:", error.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAcceptRequest = async (
    connectionId: string,
    senderId: string,
  ) => {
    try {
      const { error } = await supabase
        .from("connections")
        .update({ status: "accepted" })
        .eq("id", connectionId);

      if (!error) {
        setPendingRequests((prev) =>
          prev.filter((req) => req.connectionId !== connectionId),
        );
      } else {
        console.error("Error accepting request:", error.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeclineRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from("connections")
        .update({ status: "declined" })
        .eq("id", connectionId);

      if (!error) {
        setPendingRequests((prev) =>
          prev.filter((req) => req.connectionId !== connectionId),
        );
      } else {
        console.error("Error declining request:", error.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-6 justify-start">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-center font-barriecito">
          Connections
        </h1>
        <p className="text-muted-foreground text-center">
          Search for other users and send friend requests
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>
      </div>

      {/* Pending Requests */}
      {pendingLoading ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Loading pending requests...</p>
        </div>
      ) : pendingRequests.length > 0 ? (
        <div className="w-full max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">
            Pending Friend Requests
          </h2>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.connectionId}
                className="border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{request.username}</h3>
                  <p className="text-sm text-muted-foreground">
                    📍 {request.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      handleAcceptRequest(request.connectionId, request.id)
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleDeclineRequest(request.connectionId)}
                    variant="outline"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Search Results */}
      <div className="w-full max-w-2xl mx-auto">
        {loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Searching...</p>
          </div>
        )}

        {searchResults.length === 0 && searchQuery && !loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No users found matching "{searchQuery}"
            </p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-4">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="border rounded-lg p-6 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{user.username}</h3>
                  <p className="text-sm text-muted-foreground">
                    📍 {user.location}
                  </p>
                </div>
                <Button
                  onClick={() => handleSendFriendRequest(user.id)}
                  disabled={
                    user.isFriendRequested || friendRequests.has(user.id)
                  }
                  variant={
                    user.isFriendRequested || friendRequests.has(user.id)
                      ? "outline"
                      : "default"
                  }
                >
                  {user.isFriendRequested || friendRequests.has(user.id)
                    ? "Request Sent"
                    : "Send Friend Request"}
                </Button>
              </div>
            ))}
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Start searching for users to connect with
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
