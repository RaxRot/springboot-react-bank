package com.raxrot.back.services.impl;

import com.raxrot.back.security.dto.UserInfoResponse;
import com.raxrot.back.security.services.UserDetailsImpl;
import com.raxrot.back.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Override
    public ResponseEntity<UserInfoResponse> getUserInfo(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        UserInfoResponse resp = new UserInfoResponse(
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles
        );

        return ResponseEntity.ok(resp);
    }
}
