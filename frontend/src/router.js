import VueRouter from "vue-router"
import Login from "@/views/user/Login"
import Register from '@/views/user/Register'
import Hotel from '@/views/hotel/Hotel'
import Room from '@/views/room/Room';
import Review from '@/views/review/Review';
import Complaint from '@/views/complaint/Complaint';
import HotelDetail from '@/views/hotel/HotelDetail';
import Profile from '@/views/user/Profile';
import UserManage from '@/views/admin/UserManage';
import ComplaintForm from "@/views/complaint/ComplaintForm";
import ReviewForm from "@/views/review/ReviewForm";
import FavoriteForm from "@/views/favorite/FavoriteForm";
import Favorite from "@/views/favorite/Favorite";
import Booking from "@/views/booking/Booking";
import Type from "@/views/roomtype/Type";
import HotelApprove from "@/views/admin/HotelApprove";
import BookingForm from "@/views/booking/BookingForm";
import BookingHotelier from "@/views/booking/BookingHotelier";
import HotelApproveDetail from "@/views/admin/HotelApproveDetail";
import BookingDetail from "@/views/booking/BookingDetail";
import BookingHotelierDetail from "@/views/booking/BookingHotelierDetail";
import ForgotPassword from "@/views/user/ForgotPassword";
import ResetPassword from "@/views/user/ResetPassword";
import ChangePassword from "@/views/user/ChangePassword";
import ActivateAccount from "@/views/user/ActivateAccount";
import OrderSuccess from "@/components/OrderSuccess";
import OrderCanceled from "@/components/OrderCanceled";
import HotelNotification from "@/views/notification/HotelNotification";

let routes = [
    // Login router
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: 'Login',
            requireRoles: ['guest']
        }
    },
    // Register router
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {
            title: 'Register',
            requireRoles: ['guest']
        }
    },
    {
        path: '/activate',
        name: 'activate',
        component: ActivateAccount,
        meta: {
            title: 'Activate account',
            requireRoles: ['guest']
        }
    },
    {
        path: '/forgot-password',
        name: 'forgotPassword',
        component: ForgotPassword,
        meta: {
            title: 'Forgot password',
            requireRoles: ['guest']
        }
    },
    {
        path: '/reset-password',
        name: 'resetPassword',
        component: ResetPassword,
        meta: {
            title: 'Reset password',
            requireRoles: ['guest']
        }
    },
    {
        path: '/change-password',
        name: 'changePassword',
        component: ChangePassword,
        meta: {
            title: 'Change password',
            requireRoles: ['user', 'hotelier', 'admin']
        }
    },
    // Profile router
    {
        path: '/profile',
        name: 'profile',
        component: Profile,
        meta: {
            title: 'Profile',
            requireRoles: ['user', 'hotelier', 'admin']
        }
    },
    // Hotel router
    {
        path: '/hotels',
        name: 'hotels',
        component: Hotel,
        meta: {
            title: 'Hotels',
            requireRoles: ['hotelier']
        }
    },
    {
        path: '/notification/hotels',
        name: 'notifications',
        component: HotelNotification,
        meta: {
            title: 'Notifications',
            requireRoles: ['hotelier']
        }
    },
    // Hotel detail router
    {
        path: '/hotels/:uuid',
        name: 'hotelDetail',
        component: HotelDetail,
        meta: {
            title: 'Hotel detail',
            requireRoles: ['hotelier']
        },
        children: [
            // Room router
            {
                path: '/hotels/:uuid/rooms',
                component: Room,
                name: 'rooms',
                meta: {
                    title: 'Room list',
                    requireRoles: ['hotelier']
                },
            },
            // Review router
            {
                path: '/hotels/:uuid/reviews',
                component: Review,
                name: 'reviews',
                meta: {
                    title: 'Review',
                    requireRoles: ['hotelier']
                },
            },
            // Complaint router
            {
                path: '/hotels/:uuid/complaints',
                component: Complaint,
                name: 'complaints',
                meta: {
                    title: 'Complaint',
                    requireRoles: ['hotelier']
                },
            },
            // Favorite router
            {
                path: '/hotels/:uuid/detail',
                component: FavoriteForm,
                name: 'detail',
                meta: {
                    title: 'Detail',
                    requireRoles: ['hotelier']
                },
            },
            {
                path: '/hotels/:uuid/types',
                component: Type,
                name: 'types',
                meta: {
                    title: 'Room types',
                    requireRoles: ['hotelier']
                },
            },
            {
                path: '/hotels/:uuid/bookings',
                component: BookingHotelier,
                name: 'bookingsHotelier',
                meta: {
                    title: 'Booking list',
                    requireRoles: ['hotelier']
                },
            },
        ]
    },
    {
        path: '/hotels/:uuid/bookings/detail',
        component: BookingHotelierDetail,
        name: 'bookingsHotelierDetail',
        meta: {
            title: 'Booking detail',
            requireRoles: ['hotelier']
        },
    },
    // User manage router
    {
        path: '/admin/users',
        name: 'adminUser',
        component: UserManage,
        meta: {
            title: 'Manage user',
            requireRoles: ['admin']
        }
    },
    // Hotel router for admin
    {
        path: '/admin/hotels',
        name: 'adminHotels',
        component: HotelApprove,
        meta: {
            title: 'Admin hotels',
            requireRoles: ['admin']
        }
    },
    {
        path: '/admin/hotels/:uuid',
        name: 'adminHotelDetail',
        component: HotelApproveDetail,
        meta: {
            title: 'Admin hotel detail',
            requireRoles: ['admin']
        }
    },
    // Favorite router
    {
        path: '/favorites',
        name: 'favorites',
        component: Favorite,
        meta: {
            title: 'Favorites',
            requireRoles: ['user']
        }
    },
    // Booking router
    {
        path: '/bookings',
        name: 'bookings',
        component: Booking,
        meta: {
            title: 'Bookings',
            requireRoles: ['user']
        }
    },
    {
        path: '/bookings/:uuid',
        name: 'bookingsDetail',
        component: BookingDetail,
        meta: {
            title: 'Bookings detail',
            requireRoles: ['user']
        }
    },
    // Hotel router for user
    {
        path: '/dashboard/hotels',
        name: 'dashboardHotels',
        component: Hotel,
        meta: {
            title: 'Dashboard hotels',
            requireRoles: ['user']
        }
    },
    {
        path: '/success',
        name: 'OrderSuccess',
        component: OrderSuccess,
        meta: {
            title: 'Order success',
            requireRoles: ['user']
        }
    },
    {
        path: '/canceled',
        name: 'OrderCanceled',
        component: OrderCanceled,
        meta: {
            title: 'Order canceled',
            requireRoles: ['user']
        }
    },
    // Hotel detail router for user
    {
        path: '/dashboard/hotels/:uuid',
        name: 'dashboardHotelDetail',
        component: HotelDetail,
        meta: {
            title: 'Dashboard hotel detail',
            requireRoles: ['user']
        },
        children: [
            // Room router for user
            {
                path: '/dashboard/hotels/:uuid/rooms',
                component: Room,
                name: 'dashboardRooms',
                meta: {
                    title: 'Dashboard room list',
                    requireRoles: ['user']
                },
            },
            // Review router for user
            {
                path: '/dashboard/hotels/:uuid/reviews',
                component: Review,
                name: 'dashboardReviews',
                meta: {
                    title: 'Dashboard review',
                    requireRoles: ['user']
                },
            },
            // Create complaint router for user
            {
                path: '/dashboard/hotels/:uuid/complaints',
                component: ComplaintForm,
                name: 'dashboardComplaints',
                meta: {
                    title: 'Dashboard complaint',
                    requireRoles: ['user']
                },
            },
            // Create review router for user
            {
                path: '/dashboard/hotels/:uuid/create-review',
                component: ReviewForm,
                name: 'createReview',
                meta: {
                    title: 'Create review',
                    requireRoles: ['user']
                },
            },
            // Create favorite router for user
            {
                path: '/dashboard/hotels/:uuid/favorite',
                component: FavoriteForm,
                name: 'createFavorite',
                meta: {
                    title: 'Create favorite',
                    requireRoles: ['user']
                },
            },
            {
                path: '/dashboard/hotels/:uuid/bookings',
                component: BookingForm,
                name: 'dashboardBookings',
                meta: {
                    title: 'Dashboard booking',
                    requireRoles: ['user']
                }
            },
            {
                path: '/dashboard/hotels/:uuid/types',
                component: Type,
                name: 'dashboardTypes',
                meta: {
                    title: 'Room types',
                    requireRoles: ['user']
                },
            },
        ]
    },
];

const router = new VueRouter({mode: 'history', routes});
router.beforeEach((to, from, next) => {
    // Get vuex
    let vuex = JSON.parse(localStorage.getItem('vuex'))
    // Get role
    let role = 'guest'
    if (vuex) {
        role = vuex.user.user.role
    }
    // Get require role to access to paths
    const requireRoles = to.matched.some(route => route.meta.requireRoles.includes(role))
    if (!requireRoles) {
        switch (role) {
            // Role == guest
            case 'guest':
                return next('/login')
            // Role == user
            case 'user':
                return next('/dashboard/hotels')
            // Role == hotelier
            case 'hotelier':
                return next('/hotels')
            // Role == admin
            case 'admin':
                return next('/admin/users')
        }
    }
    document.title = to.meta.title
    return next();
});

export default router
