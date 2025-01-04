
async def get_current_user(token: Annotated[str, Depends(jwt_schema)]):
    try: 
        payload = jwt.decode(token, TOKEN_SECRET, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        return {"username": username}
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

