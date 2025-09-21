
'use client';

import { Bell, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import React from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, doc, deleteDoc, updateDoc, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { ScrollArea } from '../ui/scroll-area';

type Notification = {
    id: string;
    title: string;
    createdAt: Date;
    userId: string;
    isRead: boolean;
};

export function NotificationCenter() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useAuth();
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  React.useEffect(() => {
    if (!user || !user.email) return;

    const q = query(
        collection(db, `users/${user.email}/notifications`), 
        orderBy('createdAt', 'desc'),
        limit(20)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Notification[];
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  const markAllAsRead = async () => {
    if (!user || !user.email) return;
    const q = query(
        collection(db, `users/${user.email}/notifications`),
        where('isRead', '==', false)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { isRead: true });
    });
  };

  React.useEffect(() => {
    if (isOpen && unreadCount > 0) {
        // Mark notifications as read when popover is opened
        markAllAsRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  
  const handleDeleteNotification = async (notificationId: string) => {
    if (!user || !user.email) return;
    const notifRef = doc(db, `users/${user.email}/notifications`, notificationId);
    await deleteDoc(notifRef);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
                {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Your latest updates.
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
                                {format(new Date(notification.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
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
  );
}
