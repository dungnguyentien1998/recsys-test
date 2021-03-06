export default {
    // Reset status
    resetStatus: state => {
        state.status = ''
    },
    // Save hotel list
    listHotels: (state, payload) => {
        state.hotels = payload.data.hotels
        state.count = payload.data.count
    },
    // Save new hotel
    createHotel: (state, payload) => {
        if (payload.data.success) {
            // state.hotels.push(payload.data.hotel)
        } else {
            state.status = 'FAILED'
        }
    },
    // Save updated hotel
    updateHotel: (state, payload) => {
        if (payload.data.success) {
            let hotel = payload.data.hotel
            let index = state.hotels.findIndex(item => item.uuid === hotel.uuid)
            state.hotels = [
                ...state.hotels.slice(0, index),
                hotel,
                ...state.hotels.slice(index + 1)
            ]
        } else {
            state.status = 'FAILED'
        }
    },
    // Delete hotel from list
    deleteHotel: (state, payload) => {
        if (payload.data.success) {
            let hotel = payload.data.hotel
            state.hotels = state.hotels.filter(item => item.item !== hotel.uuid)
        } else {
            state.status = 'FAILED'
        }
    },
    setHotelierCount: (state, payload) => {
        state.count_hotelier = payload
    },
    setOldHotelierCount: (state, payload) => {
        state.old_count_hotelier = payload
    },
    setName: (state, payload) => {
        state.name = payload
    },
    setPage: (state, payload) => {
        state.page = payload
    },
    setCity: (state, payload) => {
        state.city = payload
    },
    setDistrict: (state, payload) => {
        state.district = payload
    },
    setWard: (state, payload) => {
        state.ward = payload
    },
    setStar: (state, payload) => {
        state.star = payload
    },
    setAmenities: (state, payload) => {
        state.amenities = payload
    },
    setIsSearch: (state, payload) => {
        state.is_search = payload
    },
    saveHotel: (state, payload) => {
        if (payload.success) {
            state.hotels.unshift(payload.hotel)
        } else {
            state.status = 'FAILED'
        }
    },
    saveNotifyHotel: (state, payload) => {
        if (payload.success) {
            state.notify_hotels.unshift(payload.hotel)
        } else {
            state.status = 'FAILED'
        }
    },
    notifyHotels: (state, payload) => {
        state.notify_hotels = payload.data.hotels
    },
    saveNewCount: state => {
        state.new_count = state.new_count + 1
    },
    resetNewCount: state => {
        state.new_count = 0
    },
    listNames: (state, payload) => {
        state.names = payload.data.names
    },
    listUuids: (state, payload) => {
        state.uuids = payload.data.uuids
    },
    saveUuid: (state, payload) => {
        state.uuids.unshift(payload)
    },
    setFullCount: (state, payload) => {
        state.full_count = payload
    },
    getHotel: (state, payload) => {
        state.hotel = payload.data.hotel
    }
}
