from typing import Optional
from fastapi import Query
from backend.database import repo, DataRepository

def get_repository() -> DataRepository:
    """Dependency provider for SURAKSHA data repository."""
    return repo

class PaginationParams:
    def __init__(
        self,
        skip: int = Query(0, ge=0, description="Offset"),
        limit: int = Query(50, ge=1, le=200, description="Page limit"),
    ):
        self.skip = skip
        self.limit = limit
