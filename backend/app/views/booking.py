from rest_framework.response import Response
from rest_framework.views import APIView
from app import models
from app.serializers import BookingSerializer, BookingDetailSerializer
from app.permissions.booking import BookingPermission
from app.utils.serializer_validator import validate_serializer
from pusher import Pusher
from django.db import transaction
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


class Booking(APIView):
    def get(self, request):
        user = request.user
        bookings = models.Booking.objects.filter(user_id=user.uuid)
        return Response({
            'success': True,
            'bookings': BookingDetailSerializer(bookings, many=True).data
        })

    def post(self, request):
        with transaction.atomic():
            serializer = BookingSerializer(data=request.data, context={'request': request})
            validate_serializer(serializer=serializer)
            booking = serializer.save()
            pusher = Pusher(app_id='1209674', key='5d873d3e35474aa76004', secret='ffcb966b2161f86209bc', cluster='ap1')
            message = {
                'success': True,
                'booking': BookingDetailSerializer(booking).data
            }
            pusher.trigger(u'a_channel', u'an_event_3', message)

        return Response(message)


class BookingDetail(APIView):
    def get(self, request, booking_id):
        booking = models.Booking.objects.get(uuid=booking_id)
        return Response({
            'success': True,
            'booking': BookingDetailSerializer(booking).data
        })

    def delete(self, request, booking_id):
        booking = models.Booking.objects.get(uuid=booking_id)
        booking.delete()
        response_data = BookingDetailSerializer(booking).data
        booking_types = models.BookingType.objects.filter(booking_id=booking_id)
        for booking_type in booking_types:
            booking_type.delete()

        booking_rooms = models.BookingRoom.objects.filter(booking_id=booking_id)
        for booking_room in booking_rooms:
            booking_room.delete()
        return Response({
            'success': True,
            'booking': response_data
        })


class HotelierBooking(APIView):
    def get(self, request, hotel_id):
        bookings = models.Booking.objects.filter(hotel_id=hotel_id)
        params = {}
        if request.GET.get('user_name'):
            params['user_name'] = request.GET.get('user_name')
            bookings = bookings.filter(user__name__icontains=request.GET.get('user_name'))
        if request.GET.get('user_tel'):
            params['user_tel'] = request.GET.get('user_tel')
            bookings = bookings.filter(user__tel__icontains=request.GET.get('user_tel'))
        if request.GET.get('user_email'):
            params['user_email'] = request.GET.get('user_email')
            bookings = bookings.filter(user__email__icontains=request.GET.get('user_email'))
        if request.GET.get('code'):
            params['code'] = request.GET.get('code')
            bookings = bookings.filter(code__icontains=request.GET.get('code'))

        bookings = bookings.order_by('created')
        results = []
        if request.GET.get('status') == 'yes':
            params['status'] = True
            for booking in bookings:
                room_number = booking.room_number
                if len(room_number) > 0:
                    results.append(booking)

        data = []

        page = request.GET.get('page', 1)
        paginator = Paginator(results, 10)
        if not results:
            paginator = Paginator(bookings, 10)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        return Response({
            'success': True,
            'bookings': BookingDetailSerializer(data, many=True).data,
            'count': paginator.count,
        })

        # bookings = models.Booking.objects.filter(hotel_id=hotel_id)
        #
        # return Response({
        #     'success': True,
        #     'bookings': BookingDetailSerializer(bookings, many=True).data
        # })


class HotelierBookingDetail(APIView):
    # Get the available rooms from all room type in an user booking
    def get(self, request, hotel_id, booking_id):
        booking = models.Booking.objects.get(uuid=booking_id)
        check_in_time = booking.check_in_time
        check_out_time = booking.check_out_time

        booking_types = models.BookingType.objects.filter(booking_id=booking_id)
        booking_rooms = models.BookingRoom.objects.filter(booking_id=booking_id)
        room_types = []
        for booking_type in booking_types:
            temp_dict = {'room_type': '', 'room_number': [], 'amount': 0, 'room_booked': []}
            room_type = models.Type.objects.get(uuid=booking_type.type_id)
            temp_dict['room_type'] = room_type.name
            temp_dict['amount'] = booking_type.count
            rooms = models.Room.objects.filter(type_id=room_type.uuid)
            for room in rooms:
                current_booking_rooms = models.BookingRoom.objects.filter(room_id=room.uuid)
                check = True
                for current_booking_room in current_booking_rooms:
                    current_booking = models.Booking.objects.get(uuid=current_booking_room.booking_id)
                    if current_booking.check_in_time < check_out_time <= current_booking.check_out_time:
                        check = False
                        break
                    if check_out_time > current_booking.check_out_time > check_in_time:
                        check = False
                        break

                if check:
                    temp_dict['room_number'].append(room.room_number)

            for booking_room in booking_rooms:
                room = models.Room.objects.get(uuid=booking_room.room_id)
                if room.room_type == room_type.name:
                    temp_dict['room_booked'].append(room.room_number)

            temp_dict['room_number'].sort(key=int)
            temp_dict['room_booked'].sort(key=int)

            room_types.append(temp_dict)

        return Response({
            'success': True,
            'types': room_types
        })

    def delete(self, request, hotel_id, booking_id):
        booking = models.Booking.objects.get(uuid=booking_id)
        booking.delete()
        response_data = BookingDetailSerializer(booking).data
        booking_types = models.BookingType.objects.filter(booking_id=booking_id)
        for booking_type in booking_types:
            booking_type.delete()

        booking_rooms = models.BookingRoom.objects.filter(booking_id=booking_id)
        for booking_room in booking_rooms:
            booking_room.delete()
        return Response({
            'success': True,
            'booking': response_data
        })


class BookingUuid(APIView):
    permission_classes = ()

    def get(self, request, hotel_id):
        bookings = models.Booking.objects.filter(hotel_id=hotel_id)

        uuids = []
        for booking in bookings:
            uuids.append(booking.uuid)

        return Response({
            'success': True,
            'uuids': uuids
        })
