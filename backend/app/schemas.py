from pydantic import BaseModel, EmailStr, Field

class SignupRequest(BaseModel):
    name: str = Field(..., min_length=1, description="Full name of the user", json_schema_extra={"example": "Chahat"})
    email: EmailStr = Field(..., description="Valid email address", json_schema_extra={"example": "chahat@gmail.com"})
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long", json_schema_extra={"example": "password123"})

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered email address", json_schema_extra={"example": "chahat@gmail.com"})
    password: str = Field(..., min_length=1, description="Account password", json_schema_extra={"example": "password123"})

class UserResponse(BaseModel):
    uid: str = Field(..., json_schema_extra={"example": "abc123xyz456"})
    name: str = Field(..., json_schema_extra={"example": "Chahat"})
    email: EmailStr = Field(..., json_schema_extra={"example": "chahat@gmail.com"})

class SignupResponse(BaseModel):
    message: str = Field(default="User registered successfully", json_schema_extra={"example": "User registered successfully"})
    user: UserResponse

class LoginResponse(BaseModel):
    message: str = Field(default="Login successful", json_schema_extra={"example": "Login successful"})
    idToken: str = Field(..., json_schema_extra={"example": "eyJhbGciOiJSUzI1NiIs..."})
    refreshToken: str = Field(..., json_schema_extra={"example": "AMf-vBy..."})
    expiresIn: str = Field(..., json_schema_extra={"example": "3600"})
    user: UserResponse

class ErrorResponse(BaseModel):
    detail: str = Field(..., json_schema_extra={"example": "Invalid credentials"})
