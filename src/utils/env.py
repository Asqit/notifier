from dotenv import load_dotenv
import os 

load_dotenv()

def get_var(key: str, fallback: str | None = None) -> str:
    entry = os.getenv(key)
    if not entry:
        if fallback:
            return fallback
        
        print("error: failed to read env. variable and fallback was not provided")
        exit(1)
    
    return entry