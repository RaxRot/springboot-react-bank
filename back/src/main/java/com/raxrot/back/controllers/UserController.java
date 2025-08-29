package com.raxrot.back.controllers;

import com.raxrot.back.dtos.ChangePasswordRequest;
import com.raxrot.back.dtos.ForgotUsernameRequest;
import com.raxrot.back.dtos.UpdateUsernameRequest;
import com.raxrot.back.dtos.UserResponse;
import com.raxrot.back.security.dto.UserInfoResponse;
import com.raxrot.back.security.jwt.JwtUtils;
import com.raxrot.back.security.services.UserDetailsImpl;
import com.raxrot.back.services.UserService;
import com.raxrot.back.utils.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final AuthUtil authUtil;
    private final JwtUtils jwtUtils;

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

    @PatchMapping(value="/uploadimg", consumes= MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> uploadImg(
            @RequestParam("file") MultipartFile file) {
        UserResponse response = userService.uploadImgProfilePic(file);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/username")
    public ResponseEntity<UserResponse> updateUsername(
            @Valid @RequestBody UpdateUsernameRequest request) {
        UserResponse resp = userService.updateUsername(request);

        Authentication current = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl old = (UserDetailsImpl) current.getPrincipal();

        // build new principal
        UserDetailsImpl refreshed = new UserDetailsImpl(
                old.getId(),
                resp.getUserName(),        // new username
                resp.getEmail(),
                old.getPassword(),
                old.getAuthorities()
        );

        // upd SecurityContext
        UsernamePasswordAuthenticationToken newAuth =
                new UsernamePasswordAuthenticationToken(refreshed, current.getCredentials(), refreshed.getAuthorities());
        newAuth.setDetails(current.getDetails());
        SecurityContextHolder.getContext().setAuthentication(newAuth);

        // new jwt cookie
        ResponseCookie jwtCookie = jwtUtils.getJwtCookie(refreshed);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(resp);
    }

    @PatchMapping("/password")
    public ResponseEntity<?> updatePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.updatePassword(request);
        ResponseCookie clean = jwtUtils.getCleanJwtCookie();
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clean.toString())
                .build();
    }

    @PostMapping("/remind-username")
    public ResponseEntity<?> remindUsername(
            @Valid @RequestBody ForgotUsernameRequest request) {
        userService.sendUsernameReminder(request);
        return ResponseEntity.ok(Map.of("message", "If this email exists in our system, you will receive a reminder"));
    }
}
