package com.raxrot.back.controllers;

import com.raxrot.back.security.dto.UserInfoResponse;
import com.raxrot.back.services.UserService;
import com.raxrot.back.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final AuthUtil authUtil;
    @GetMapping
    public ResponseEntity<UserInfoResponse> getUserInfo(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return userService.getUserInfo(authentication);
    }

    @GetMapping("/username")
    public String getCurrentUserName(Authentication authentication) {
        return (authentication != null) ? authentication.getName() : "NULL";
    }
}
