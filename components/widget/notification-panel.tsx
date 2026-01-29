"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Bell, MessageSquare, Heart, Star, Shield, AlertTriangle, X, Settings, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useNotification, useInstructorNotification, useMarkAllRead, useDeleteNotification, useDeleteAllNotifications } from "@/hooks/useNotification";
import { notificationService, NotificationItem as ApiNotificationItem, NotificationChannel as ApiNotificationChannel, NotificationStatus as ApiNotificationStatus } from "@/lib/api/services/fetchNotification";
import { formatDistanceToNow, isToday } from "date-fns";
import { vi } from "date-fns/locale";


// Mock Data Types (Updated to match component needs, mapped from API)
type NotificationType = "message" | "like" | "system" | "warning" | "success" | "star";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  date: "today" | "earlier";
  read: boolean;
  sender?: {
    name: string;
    avatar?: string;
  };
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case "message": return <MessageSquare className="w-4 h-4 text-blue-500" />;
    case "like": return <Heart className="w-4 h-4 text-pink-500" />;
    case "warning": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case "success": return <Shield className="w-4 h-4 text-green-500" />;
    case "star": return <Star className="w-4 h-4 text-yellow-500" />;
    case "system": return <Settings className="w-4 h-4 text-purple-500" />;
    default: return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

const getGradient = (type: NotificationType) => {
  switch (type) {
    case "message": return "bg-blue-500/10 border-blue-500/20";
    case "like": return "bg-pink-500/10 border-pink-500/20";
    case "warning": return "bg-amber-500/10 border-amber-500/20";
    case "success": return "bg-green-500/10 border-green-500/20";
    case "star": return "bg-yellow-500/10 border-yellow-500/20";
    case "system": return "bg-purple-500/10 border-purple-500/20";
    default: return "bg-gray-500/10 border-gray-500/20";
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 30 } }
};

interface NotificationItemProps {
  notification: Notification;
  onDelete: (id: string) => void;
}

const NotificationSkeleton = () => (
  <div className="space-y-4 px-5 pt-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-4 p-4 rounded-2xl border border-gray-100/50 bg-white/50">
        <Skeleton className="h-11 w-11 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

const NotificationItem = ({ notification, onDelete }: NotificationItemProps) => (
  <motion.div
    layout
    variants={itemVariants}
    exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
    className={cn(
      "group relative flex gap-4 p-4 rounded-2xl transition-all duration-300 mb-3",
      notification.read
        ? "bg-transparent hover:bg-gray-50/80 border border-transparent hover:border-gray-100"
        : "bg-white shadow-sm border border-purple-100/60 shadow-purple-500/5"
    )}
  >
    <div className={cn("relative flex h-11 w-11 shrink-0 select-none items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shadow-sm", getGradient(notification.type))}>
      {notification.sender?.avatar ? (
        <Avatar className="h-full w-full rounded-2xl">
          <AvatarImage src={notification.sender.avatar} />
          <AvatarFallback className="rounded-2xl">{notification.sender.name[0]}</AvatarFallback>
        </Avatar>
      ) : (
        getIcon(notification.type)
      )}
      {!notification.read && (
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 border-[2px] border-white"></span>
        </span>
      )}
    </div>

    <div className="flex-1 space-y-1.5 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <p className={cn("text-sm font-semibold leading-tight transition-colors truncate pr-6", notification.read ? "text-gray-600" : "text-gray-900")}>
          {notification.title}
        </p>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium bg-gray-50/80 px-2 py-1 rounded-full whitespace-nowrap">
          {notification.time}
        </span>
      </div>
      <p className={cn("text-xs leading-relaxed line-clamp-2", notification.read ? "text-muted-foreground/80" : "text-gray-600")}>
        {notification.description}
      </p>
    </div>

    {/* Hover Actions */}
    <div className="absolute right-2 top-11 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 z-10 translate-x-2 group-hover:translate-x-0">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 bg-white shadow-sm border border-gray-100"
        onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
        title="Xóa"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  </motion.div>
);

interface GroupedNotificationsProps {
  list: Notification[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
  observerRef?: ((node: HTMLDivElement | null) => void) | React.RefObject<HTMLDivElement | null>;
  isFetchingNextPage?: boolean;
}

const GroupedNotifications = ({ list, onDelete, isLoading, observerRef, isFetchingNextPage }: GroupedNotificationsProps) => {
  if (isLoading) return <NotificationSkeleton />;

  const today = list.filter(n => n.date === "today");
  const earlier = list.filter(n => n.date === "earlier");

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" exit="hidden" className="px-5 pb-6 pt-2 space-y-6">
      {list.length === 0 && (
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="flex flex-col items-center justify-center py-24 text-center space-y-4"
         >
           <div className="h-24 w-24 bg-gray-50/50 rounded-full flex items-center justify-center shadow-inner">
             <Bell className="h-10 w-10 text-gray-300/50" />
           </div>
           <div className="space-y-1.5">
             <p className="text-base font-semibold text-gray-900">Không có thông báo nào</p>
             <p className="text-sm text-gray-400">Bạn đã cập nhật tất cả thông tin!</p>
           </div>
         </motion.div>
      )}

      {today.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Hôm nay
          </h5>
          <AnimatePresence mode="popLayout">
            {today.map(n => <NotificationItem key={n.id} notification={n} onDelete={onDelete} />)}
          </AnimatePresence>
        </div>
      )}

      {earlier.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
           Trước đó
         </h5>
         <AnimatePresence mode="popLayout">
           {earlier.map(n => <NotificationItem key={n.id} notification={n} onDelete={onDelete} />)}
         </AnimatePresence>
       </div>
      )}

      {/* Sentinel for infinite scroll - Always visible at bottom */}
      <div 
        ref={observerRef} 
        className="h-10 w-full flex items-center justify-center min-h-[40px]"
        style={{ background: 'transparent' }}
      >
        {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin text-purple-500" />}
      </div>
    </motion.div>
  );
};

export function NotificationPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { isInstructor } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [loadingTab, setLoadingTab] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const [sentinelElement, setSentinelElement] = useState<HTMLDivElement | null>(null);
  
  const [allNotifications, setAllNotifications] = useState<ApiNotificationItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false); 

  const params = useMemo(() => {
    const base = {
      status: ApiNotificationStatus.Delivered,
      channel: ApiNotificationChannel.App,
      pageNumber: 1,
      pageSize: 10,
      isDescending: true
    };
    
    if (activeTab === "unread") {
      return { ...base, isRead: false };
    }
    return base;
  }, [activeTab]); 

  const { 
    data: instructorUnreadData
  } = useInstructorNotification({
    ...params, 
    status: ApiNotificationStatus.Delivered,
    channel: ApiNotificationChannel.App,
    isRead: false,
    pageSize: 1,
    pageNumber: 1
  }, { enabled: !!isInstructor && open });

  const { totalCount: studentUnreadCount } = useNotification({
    status: ApiNotificationStatus.Delivered,
    channel: ApiNotificationChannel.App,
    isRead: false,
    pageSize: 1,
    pageNumber: 1
  }, { enabled: !isInstructor && open });

  const realUnreadCount = isInstructor 
    ? (instructorUnreadData?.userNotifications?.totalCount || 0)
    : (studentUnreadCount || 0);

  const { 
    data: instructorData, 
    isLoading: loadingInstructor 
  } = useInstructorNotification(params, { enabled: !!isInstructor && open });
  
  const { 
    notifications: studentList, 
    totalCount: studentTotal,
    isLoading: loadingStudent 
  } = useNotification(params, { enabled: !isInstructor && open });

  const isLoadingInitial = isInstructor ? loadingInstructor : loadingStudent;

  useEffect(() => {
    if (!open) return;
    if (currentPage > 1) return; 

    let totalCount = 0;

    if (isInstructor) {
      if (instructorData?.userNotifications) {
        totalCount = instructorData.userNotifications.totalCount;
      }
    } else {
       totalCount = studentTotal;
    }

    if (totalCount > 0) {
       const firstPageLength = isInstructor 
         ? (instructorData?.userNotifications?.items?.length || 0)
         : (studentList?.length || 0);
       const hasMoreItems = firstPageLength < totalCount;
       setHasMore(hasMoreItems);
       
       // Force check if sentinel is already visible
    //    if (hasMoreItems && observerRef.current) {
    //      const rect = observerRef.current.getBoundingClientRect();
    //      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    //    }
    } else {
       setHasMore(false);
    }
  }, [isInstructor, instructorData, studentList, studentTotal, open, currentPage]);


  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || !open) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const currentParams = {
          status: ApiNotificationStatus.Delivered,
          channel: ApiNotificationChannel.App,
          pageNumber: nextPage,
          pageSize: 10,
          isDescending: true,
          isRead: activeTab === "unread" ? false : undefined
      };

      let response;
      let totalCount = 0;
      
      if (isInstructor) {
          response = await notificationService.getInstructorNotifications(currentParams);
      } else {
          response = await notificationService.getMyNotifications(currentParams);
      }

      if (response.isSuccess && response.data) {
          let newItems: ApiNotificationItem[] = [];
          
          if (isInstructor) {
              // @ts-expect-error - Handling conditional types from two different endpoints
              newItems = response.data.userNotifications?.items || [];
              // @ts-expect-error - Getting total count
              totalCount = response.data.userNotifications?.totalCount || 0;
          } else {
              // @ts-expect-error - Handling conditional types
              newItems = response.data.notifications || [];
              // @ts-expect-error - Getting total count
              totalCount = response.data.totalCount || 0;
          }


          if (newItems.length > 0) {
              if (currentPage === 1) {
                  const firstPageData = isInstructor 
                    ? (instructorData?.userNotifications?.items || [])
                    : (studentList || []);
                  const existingIds = new Set(firstPageData.map(n => n.id));
                  const uniqueNew = newItems.filter(n => !existingIds.has(n.id));
                  setAllNotifications([...firstPageData, ...uniqueNew]);
              } else {
                  setAllNotifications(prev => {
                      const existingIds = new Set(prev.map(n => n.id));
                      const uniqueNew = newItems.filter(n => !existingIds.has(n.id));
                      return [...prev, ...uniqueNew];
                  });
              }
              
              setCurrentPage(nextPage);
              
              const currentDataLength = currentPage === 1 
                ? ((isInstructor ? (instructorData?.userNotifications?.items?.length || 0) : (studentList?.length || 0)))
                : allNotifications.length;
              const totalLoaded = currentDataLength + newItems.length;
              const hasMoreItems = totalLoaded < totalCount;
              setHasMore(hasMoreItems);
          } else {
              setHasMore(false);
          }
      } else {
          setHasMore(false);
      }
    } catch (error) {
      console.error("❌ Error loading more notifications:", error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, open, currentPage, isInstructor, activeTab, instructorData, studentList, allNotifications]);

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      observerRef.current = node;
      setSentinelElement(node);
    }
  }, []);

  useEffect(() => {
    if (!open || !sentinelElement) {
      if (!sentinelElement) {
      }
      return;
    }
    
    
    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;
        if (isIntersecting && hasMore && !isLoadingMore && !isLoadingInitial) {
           handleLoadMore();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observer.observe(sentinelElement);

    return () => {
      observer.unobserve(sentinelElement);
    };
  }, [hasMore, isLoadingMore, isLoadingInitial, handleLoadMore, open, currentPage, sentinelElement]);

  const handleTabChange = (value: string) => {
    if (value === activeTab) return;
    setLoadingTab(true);
    setActiveTab(value);
    
    setCurrentPage(1);
    setAllNotifications([]);
    setHasMore(true);

    setTimeout(() => {
        setLoadingTab(false);
    }, 400); 
  };




  const notifications = useMemo(() => {
    if (currentPage === 1) {
      return isInstructor 
        ? (instructorData?.userNotifications?.items || [])
        : (studentList || []);
    } else {
      return allNotifications;
    }
  }, [currentPage, isInstructor, instructorData, studentList, allNotifications]);

  const mapToNotification = (item: ApiNotificationItem): Notification => {
    const created = new Date(item.createdAt);
    const dateType: "today" | "earlier" = isToday(created) ? "today" : "earlier";
    
    let type: NotificationType = "message";
    if (item.status === "Pending") type = "warning";
    if (item.status === "Failed") type = "system";

    return {
      id: item.id,
      type,
      title: item.title || "Thông báo",
      description: item.message,
      time: formatDistanceToNow(created, { addSuffix: true, locale: vi }),
      date: dateType,
      read: !!item.readAt || item.isRead === true,
      sender: { name: "System" }
    };
  };

  const notificationList = notifications.map(mapToNotification);


  const markAllReadMutation = useMarkAllRead();
  const deleteMutation = useDeleteNotification();
  const deleteAllMutation = useDeleteAllNotifications();

  const markAllAsRead = async () => {
      try {
        await markAllReadMutation.mutateAsync();
      } catch (error) {
        console.error("Failed to mark all as read", error);
      }
  };
  const deleteNotification = async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete notification", error);
      }
  };
  const deleteAllNotifications = async () => {
      try {
        await deleteAllMutation.mutateAsync();
      } catch (error) {
        console.error("Failed to delete all notifications", error);
      }
  };

  const showSkeleton = (isLoadingInitial && currentPage === 1) || loadingTab;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <AnimatePresence mode="wait">
        {open && (
          <SheetContent 
            forceMount 
            className="w-full sm:max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none data-[state=open]:animate-none data-[state=closed]:animate-none focus:outline-none"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full w-full flex flex-col bg-white/95 backdrop-blur-2xl border-l border-gray-100 shadow-[0_0_50px_-12px_rgba(0,0,0,0.15)]"
            >
              <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100/80 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center justify-start gap-8 mb-3">
                <SheetTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                  Thông báo
                </SheetTitle>
                <div className="flex items-center">
                
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={realUnreadCount === 0}
                  className="h-8 text-xs font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full px-3 transition-all"
                  onClick={markAllAsRead}
                >
                  Đánh dấu đã đọc
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={notifications.length === 0}
                  className="h-8 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full px-3 transition-all"
                  onClick={deleteAllNotifications}
                >
                  Xóa tất cả
                </Button>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-2.5 py-0.5 h-6 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100/50">
                  <span className="font-bold mr-1">{realUnreadCount || 0}</span> chưa đọc
              </Badge>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pt-0 bg-white">
              <TabsList className="w-full flex justify-start bg-transparent p-0 gap-8">
                <TabsTrigger
                  value="all"
                  className="relative rounded-none border-none px-0 pb-3 pt-2 text-sm font-semibold text-muted-foreground transition-all hover:text-gray-900 data-[state=active]:text-purple-700 data-[state=active]:shadow-none flex items-center gap-2"
                >
                  <Bell className={cn("h-4 w-4", activeTab === "all" ? "text-purple-700" : "")} />
                  Tất cả
                  {activeTab === "all" && (
                     <motion.div
                       layoutId="tab-underline"
                       className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-600"
                     />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="relative rounded-none border-none px-0 pb-3 pt-2 text-sm font-semibold text-muted-foreground transition-all hover:text-gray-900 data-[state=active]:text-purple-700 data-[state=active]:shadow-none flex items-center gap-2"
                >
                  <MessageSquare className={cn("h-4 w-4", activeTab === "unread" ? "text-purple-700" : "")} />
                  Chưa đọc
                  {activeTab === "unread" && (
                     <motion.div
                       layoutId="tab-underline"
                       className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-600"
                     />
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 bg-gradient-to-b from-white to-gray-50/50">
                <AnimatePresence mode="wait">
                  {showSkeleton ? (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <NotificationSkeleton />
                    </motion.div>
                  ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                     >
                      <TabsContent key={activeTab} value={activeTab} className="mt-0 outline-none min-h-full">
                         <GroupedNotifications 
                            list={notificationList} 
                            onDelete={deleteNotification}
                            observerRef={sentinelRef}
                            isFetchingNextPage={isLoadingMore}
                         />
                      </TabsContent>
                    </motion.div>
                  )}
                </AnimatePresence>
            </ScrollArea>
          </Tabs>
        </div>
            </motion.div>
          </SheetContent>
        )}
      </AnimatePresence>
    </Sheet>
  );
}

