export interface AuthRequest {
  token: string;
};

export interface AuthResponse {

};

export interface AuthRegisterRequest {
  name: string;
}

export interface AuthRegisterResponse {
  playerId: string;
  token: string;
}

export interface AuthError {
  type: "FAILED_AUTH" | "FAILED_REGISTER";
  message: string;
}

