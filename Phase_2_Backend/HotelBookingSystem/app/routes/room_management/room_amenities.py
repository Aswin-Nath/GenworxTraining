from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.postgres_connection import get_db
from app.models.sqlalchemy_schemas.rooms import RoomAmenityMap, Rooms, RoomAmenities
from app.models.pydantic_models.room import RoomAmenityMapCreate, RoomAmenityMapResponse
from fastapi import Depends
from app.dependencies.authentication import ensure_not_basic_user
from app.services.room_management.room_amenities_service import (
    map_amenity as svc_map_amenity,
    get_amenities_for_room as svc_get_amenities_for_room,
    unmap_amenity as svc_unmap_amenity,
)

router = APIRouter(prefix="/api/room-amenities", tags=["ROOM_AMENITIES"])


@router.post("/", response_model=RoomAmenityMapResponse, status_code=status.HTTP_201_CREATED)
async def map_amenity(payload: RoomAmenityMapCreate, db: AsyncSession = Depends(get_db), _=Depends(ensure_not_basic_user)):
    await svc_map_amenity(db, payload)
    return RoomAmenityMapResponse.model_validate(payload).model_copy(update={"message": "Mapped successfully"})


@router.get("/room/{room_id}")
async def get_amenities_for_room(room_id: int, db: AsyncSession = Depends(get_db)):
    items = await svc_get_amenities_for_room(db, room_id)
    return {"room_id": room_id, "amenities": [ {"amenity_id": a.amenity_id, "amenity_name": a.amenity_name} for a in items ]}


@router.delete("/")
async def unmap_amenity(room_id: int, amenity_id: int, db: AsyncSession = Depends(get_db), _=Depends(ensure_not_basic_user)):
    await svc_unmap_amenity(db, room_id, amenity_id)
    return {"message": "Unmapped successfully"}
