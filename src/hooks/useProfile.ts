import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/lib/auth";
import type { User } from "@/types/auth";

export const useCurrentUserProfile = () => {
    return useQuery<User | null, Error>({
        queryKey: ['currentUserProfile'],
        queryFn: async () => {
            console.log('[useCurrentUserProfile] queryFn started');
            const currentUser = await AuthService.getUser();
            console.log('[useCurrentUserProfile] AuthService.getUser() returned:', currentUser);
            if (!currentUser) {
                console.log('[useCurrentUserProfile] no authenticated user');
                return null;
            }
            console.log('[useCurrentUserProfile] returning user id:', currentUser.id);
            return currentUser;
        },
        staleTime: 50 * 60 * 1000,
        retry: false,
    });
};