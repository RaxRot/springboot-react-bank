package com.raxrot.back.services;

import com.raxrot.back.dtos.ChangePasswordRequest;
import com.raxrot.back.dtos.ForgotUsernameRequest;
import com.raxrot.back.dtos.UpdateUsernameRequest;
import com.raxrot.back.dtos.UserResponse;
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
