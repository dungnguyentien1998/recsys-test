from rest_framework.response import Response
from rest_framework.views import APIView
from app import models
from app.serializers import HotelSerializer, HotelierHotelDetailSerializer, HotelDetailSerializer, HotelActiveSerializer
from app.permissions.hotel import HotelPermission
from app.utils.serializer_validator import validate_serializer
from pusher import Pusher
from django.db.models import Q
from django.db import transaction
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


class Hotel(APIView):
    permission_classes = (HotelPermission,)

    # List hotels
    def get(self, request):
        user = request.user
        is_hotelier = False
        params = {}
        if user.role == models.Role.ADMIN:
            params['status'] = models.Status.PENDING
        else:
            params['status'] = models.Status.ACTIVE

        name = ""
        if request.GET.get('name'):
            name = request.GET.get('name')
        #     params['name'] = request.GET.get('name')
        if request.GET.get('city'):
            params['city'] = request.GET.get('city')
        if request.GET.get('district'):
            params['district'] = request.GET.get('district')
        if request.GET.get('ward'):
            params['ward'] = request.GET.get('ward')
        if request.GET.get('star'):
            params['star'] = request.GET.get('star')

        hotels = models.Hotel.objects.filter(**params, name__icontains=name).order_by('name')
        if not user.is_anonymous:
            if user.role == models.Role.HOTELIER:
                hotels = models.Hotel.objects.filter(user_id=user.uuid, status=models.Status.ACTIVE)
                is_hotelier = True
            # if user.role == models.Role.ADMIN:
            #     hotels = models.Hotel.objects.filter(status=models.Status.PENDING)

        data = []

        page = request.GET.get('page', 1)
        paginator = Paginator(hotels, 6)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        if is_hotelier:
            return Response({
                'success': True,
                'hotels': HotelierHotelDetailSerializer(hotels, many=True).data
            })
        else:
            return Response({
                'success': True,
                'hotels': HotelDetailSerializer(data, many=True).data,
                'count': paginator.count,
            })
        # return Response({
        #     'success': True,
        #     'hotels': HotelierHotelDetailSerializer(hotels, many=True).data if is_hotelier == True
        #     else HotelDetailSerializer(hotels, many=True).data,
        #     # 'hotels': result_hotels
        # })

    # Create hotel
    def post(self, request):
        with transaction.atomic():
            serializer = HotelSerializer(data=request.data, context={'request': request})
            validate_serializer(serializer=serializer)
            hotel = serializer.save()

            pusher = Pusher(app_id='1209674', key='5d873d3e35474aa76004', secret='ffcb966b2161f86209bc', cluster='ap1')
            message = {
                'success': True,
                'hotel': HotelDetailSerializer(hotel).data,
            }
            pusher.trigger(u'a_channel', u'an_event', message)

        return Response(message)


class HotelDetail(APIView):
    permission_classes = ()

    # Get one hotel
    def get(self, request, hotel_id):
        user = request.user
        hotel = models.Hotel.objects.get(uuid=hotel_id)
        return Response({
            'success': True,
            'hotel': HotelierHotelDetailSerializer(hotel).data if user.role == models.Role.HOTELIER
            else HotelDetailSerializer(hotel).data
        })

    # Update hotel
    def put(self, request, hotel_id):
        hotel = models.Hotel.objects.get(uuid=hotel_id)
        self.check_object_permissions(request=request, obj=hotel)
        serializer = HotelSerializer(data=request.data, context={'request': request})
        validate_serializer(serializer=serializer)
        serializer.update(instance=hotel, validated_data=serializer.validated_data)
        return Response({
            'success': True,
            'hotel': HotelDetailSerializer(hotel).data
        })

    # Delete hotel
    def delete(self, request, hotel_id):
        hotel = models.Hotel.objects.get(uuid=hotel_id)
        self.check_object_permissions(request=request, obj=hotel)
        hotel.delete()
        return Response({
            'success': True,
            'hotel': HotelDetailSerializer(hotel).data
        })


class HotelActive(APIView):
    permission_classes = ()

    # def get(self, request):
    #     user = request.user
    #     hotels = models.Hotel.objects.filter(status=models.Status.ACTIVE)
    #     return Response({
    #         'success': True,
    #         'hotels': HotelDetailSerializer(hotels, many=True).data
    #     })

    def put(self, request, hotel_id):
        with transaction.atomic():
            hotel = models.Hotel.objects.get(uuid=hotel_id)
            serializer = HotelActiveSerializer(data=request.data)
            validate_serializer(serializer=serializer)
            serializer.update(instance=hotel, validated_data=serializer.validated_data)
            pusher = Pusher(app_id='1209674', key='5d873d3e35474aa76004', secret='ffcb966b2161f86209bc', cluster='ap1')
            message = {
                'success': True,
                'hotel': HotelDetailSerializer(hotel).data,
            }
            pusher.trigger(u'a_channel_1', u'an_event_1', message)

        return Response(message)


class HotelNotification(APIView):
    def get(self, request):
        user = request.user
        hotels = models.Hotel.objects.filter(Q(status=models.Status.ACTIVE) | Q(status=models.Status.REJECT),
                                             user_id=user.uuid)
        return Response({
            'success': True,
            'hotels': HotelDetailSerializer(hotels, many=True).data,
        })


class HotelUuid(APIView):
    permission_classes = ()

    def get(self, request):
        user = request.user
        params = {}
        if user.role == models.Role.ADMIN:
            params['status'] = models.Status.PENDING
        else:
            params['status'] = models.Status.ACTIVE

        hotels = models.Hotel.objects.filter(**params).order_by('name')
        if user.role == models.Role.HOTELIER:
            hotels = models.Hotel.objects.filter(user_id=user.uuid, status=models.Status.ACTIVE)

        uuids = []
        for hotel in hotels:
            uuids.append(hotel.uuid)

        return Response({
            'success': True,
            'uuids': uuids
        })


class HotelName(APIView):
    permission_classes = ()

    def get(self, request):
        user = request.user
        params = {}
        if user.role == models.Role.ADMIN:
            params['status'] = models.Status.PENDING
        else:
            params['status'] = models.Status.ACTIVE

        hotels = models.Hotel.objects.filter(**params).order_by('name')
        names = []
        for hotel in hotels:
            names.append(hotel.name)

        return Response({
            'success': True,
            'names': names
        })
