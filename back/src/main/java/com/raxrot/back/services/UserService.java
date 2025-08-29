package com.raxrot.back.services;

import com.raxrot.back.security.dto.UserInfoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

public interface UserService {
    ResponseEntity<UserInfoResponse> getUserInfo(Authentication authentication);
}
