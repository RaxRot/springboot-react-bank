package com.raxrot.back.services;

import com.raxrot.back.dtos.*;
import com.raxrot.back.security.dto.UserInfoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    ResponseEntity<UserInfoResponse> getUserInfo(Authentication authentication);
    UserResponse uploadImgProfilePic(MultipartFile file);
    UserResponse updateUsername(UpdateUsernameRequest request);
    void updatePassword(ChangePasswordRequest request);
    void sendUsernameReminder(ForgotUsernameRequest request);
}
