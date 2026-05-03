
'use client';

import { Bell, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import React from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, doc, deleteDoc, updateDoc, where, getDocs, Timestamp } from 'firebase/firestore';
import { ScrollArea } from '../ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';

type Notification = {
    id: string;
    title: string;
    createdAt: Timestamp;
    userId: string;
    isRead: boolean;
};

export function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  
  React.useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async () => {
    if (!user) return;
    const unreadNotifications = notifications.filter(n => !n.isRead);
    const promises = unreadNotifications.map(n => updateDoc(doc(db, 'notifications', n.id), { isRead: true }));
    await Promise.all(promises);
  };
  
  const handlePopoverOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      handleMarkAsRead();
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteDoc(doc(db, 'notifications', notificationId));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={isOpen} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl shadow-indigo-500/30 transition-transform hover:scale-110 group relative"
          >
            {unreadCount > 0 && (
              <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-75"></span>
            )}
            <Bell className={`h-6 w-6 text-white relative z-10 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
            {unreadCount > 0 && (
              <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-6 w-6 p-0 flex items-center justify-center text-xs font-bold border-2 border-white relative z-20 shadow-sm"
              >
                  {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mb-4 mr-6 p-0 overflow-hidden border-indigo-100 shadow-2xl" align="end" sideOffset={12}>
        <div className="grid gap-4 p-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-base leading-none text-indigo-950">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Your latest updates and alerts.
            </p>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="grid gap-2 pr-2">
              {notifications.length > 0 ? (
                   notifications.map((notification) => (
                      <div
                          key={notification.id}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-accent group"
                      >
                          {!notification.isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                          <div className="flex-grow ml-1">
                            <p className="text-sm font-medium">
                                {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {notification.createdAt && format(notification.createdAt.toDate(), "MMM dd, yyyy 'at' hh:mm a")}
                            </p>
                          </div>
                           <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100"
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                                <Trash2 className="h-4 w-4"/>
                           </Button>
                      </div>
                   ))
              ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No new notifications.</p>
              )}
            </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
