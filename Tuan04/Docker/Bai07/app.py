import os

app_env = os.getenv("APP_ENV", "not set")

print(f"App is running in: {app_env}")