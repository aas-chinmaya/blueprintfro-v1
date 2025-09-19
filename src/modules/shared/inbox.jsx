
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  fetchNotifications,
  deleteNotification,
  deleteAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/features/shared/notificationSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function Inbox({ recipientId }) {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const dispatch = useDispatch();

  const {
    items: notifications = [],
    loading,
    error,
  } = useSelector((state) => state.notifications) || {};

  useEffect(() => {
    if (recipientId) {
      dispatch(fetchNotifications(recipientId));
    }
  }, [dispatch, recipientId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      dispatch(markAllNotificationsAsRead(recipientId));
    }
  };

  const handleDeleteNotification = (id) => {
    dispatch(deleteNotification(id));
    if (selectedNotification?._id === id) {
      setSelectedNotification(null);
    }
  };

  const handleDeleteAllNotifications = () => {
    dispatch(deleteAllNotifications(recipientId));
    setSelectedNotification(null);
  };

  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification._id));
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const minutes = Math.floor((now - date.getTime()) / 60000);

    if (minutes < 1) return "Received just now";
    if (minutes < 60) return `Received ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `Received ${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
    return `Received on ${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Left Side: Notification List - Full width on mobile, 1/4 on large screens */}
      <div className="w-full md:w-1/4 border-r bg-muted/10 p-4 flex flex-col">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h4 className="font-semibold text-lg">
            Notifications{" "}
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </h4>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleMarkAllAsRead}>
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark all as read</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {notifications.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleDeleteAllNotifications}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear all</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
          {loading.fetch ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          ) : error.fetch ? (
            <div className="py-6 text-center text-rose-500">
              {error.fetch}
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              <Bell className="mx-auto h-8 w-8 mb-2" />
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification._id || notification.id}
                  onClick={() => handleSelectNotification(notification)}
                  className={cn(
                    "py-3 px-3 cursor-pointer hover:bg-indigo-50 transition-colors group rounded-lg",
                    !notification.read && "bg-indigo-100/50",
                    selectedNotification?._id === notification._id && "bg-indigo-200"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{notification.message}</p>
                        <Badge
                          variant={notification.read ? "secondary" : "destructive"}
                          className={cn(
                            "text-xs",
                            notification.read
                              ? "bg-green-100 text-green-700"
                              : "bg-rose-100 text-rose-700"
                          )}
                        >
                          {notification.read ? "Read" : "Unread"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(notification.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(markNotificationAsRead(notification._id));
                          }}
                          className="h-6 w-6"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification._id);
                        }}
                        className="h-6 w-6"
                      >
                        <X className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Notification Details - Hidden on mobile, visible on large screens */}
      <div className="hidden md:flex md:w-3/4 p-6 flex-col">
        {selectedNotification ? (
          <div className="flex-1">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-xl font-semibold">Notification Details</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteNotification(selectedNotification._id)}
              >
                <Trash2 className="h-5 w-5 text-rose-500" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Message</h4>
                <p className="text-sm text-muted-foreground">{selectedNotification.message}</p>
              </div>
              <div>
                <h4 className="font-medium">Received</h4>
                <p className="text-sm text-muted-foreground">
                  {formatTimestamp(selectedNotification.createdAt)}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Status</h4>
                <Badge
                  variant={selectedNotification.read ? "secondary" : "destructive"}
                  className={cn(
                    "text-xs",
                    selectedNotification.read
                      ? "bg-green-100 text-green-700"
                      : "bg-rose-100 text-rose-700"
                  )}
                >
                  {selectedNotification.read ? "Read" : "Unread"}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a notification to view details</p>
          </div>
        )}
      </div>

      {/* Modal for Notification Details on Mobile */}
      <Dialog open={selectedNotification && window.innerWidth < 768} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" onClick={() => setSelectedNotification(null)}>
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Message</h4>
                <p className="text-sm text-muted-foreground">{selectedNotification.message}</p>
              </div>
              <div>
                <h4 className="font-medium">Received</h4>
                <p className="text-sm text-muted-foreground">
                  {formatTimestamp(selectedNotification.createdAt)}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Status</h4>
                <Badge
                  variant={selectedNotification.read ? "secondary" : "destructive"}
                  className={cn(
                    "text-xs",
                    selectedNotification.read
                      ? "bg-green-100 text-green-700"
                      : "bg-rose-100 text-rose-700"
                  )}
                >
                  {selectedNotification.read ? "Read" : "Unread"}
                </Badge>
              </div>
              <Button
                variant="destructive"
                onClick={() => handleDeleteNotification(selectedNotification._id)}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Notification
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}