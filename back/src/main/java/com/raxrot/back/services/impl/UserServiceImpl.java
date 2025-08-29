package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.ChangePasswordRequest;
import com.raxrot.back.dtos.ForgotUsernameRequest;
import com.raxrot.back.dtos.UpdateUsernameRequest;
import com.raxrot.back.dtos.UserResponse;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.User;
import com.raxrot.back.repositories.UserRepository;
import com.raxrot.back.security.dto.UserInfoResponse;
import com.raxrot.back.security.services.UserDetailsImpl;
import com.raxrot.back.services.EmailService;
import com.raxrot.back.services.FileUploadService;
import com.raxrot.back.services.UserService;
import com.raxrot.back.utils.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final FileUploadService fileUploadService;
    private final ModelMapper modelMapper;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

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

    @Transactional
    @Override
    public UserResponse uploadImgProfilePic(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException("File is empty", HttpStatus.BAD_REQUEST);
        }
        User user=authUtil.loggedInUser();

        String oldUrl = user.getProfilePic();

        String profileUrl = fileUploadService.uploadFile(file);
        user.setProfilePic(profileUrl);
        User savedUser = userRepository.save(user);

        if (oldUrl != null && !oldUrl.isBlank()) {
            try {
                fileUploadService.deleteFile(oldUrl);
            } catch (Exception ignored) {

            }
        }
        return modelMapper.map(savedUser, UserResponse.class);
    }

    @Override
    public UserResponse updateUsername(UpdateUsernameRequest request) {
        String newUsername = request.getNewUsername();
        User me = authUtil.loggedInUser();
        if (newUsername.equals(me.getUserName()))
            throw new ApiException("New username is the same as current", HttpStatus.BAD_REQUEST);
        if (userRepository.existsByUserName(newUsername))
            throw new ApiException("Username is already taken", HttpStatus.CONFLICT);

        me.setUserName(newUsername);
        User saved = userRepository.save(me);

        sendEmailUsernameUpdated(me, newUsername);

        return modelMapper.map(saved, UserResponse.class);
    }

    @Override
    public void updatePassword(ChangePasswordRequest request) {
        User me = authUtil.loggedInUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), me.getPassword())){
            throw new ApiException("Current password does not match", HttpStatus.BAD_REQUEST);
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ApiException("Confirm password does not match", HttpStatus.BAD_REQUEST);
        }
        if (passwordEncoder.matches(request.getNewPassword(), me.getPassword())){
            throw new ApiException("New password is the same as current", HttpStatus.CONFLICT);
        }

        me.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(me);
    }

    @Override
    public void sendUsernameReminder(ForgotUsernameRequest request) {
        Optional<User> user=userRepository.findByEmail(request.getEmail());
        if (user.isPresent()) {
            sendEmailRemindUsername(user.get());
        }
    }

    private void sendEmailUsernameUpdated(User me, String newUsername) {
        emailService.sendEmail(
                me.getEmail(),
                "🔄 Your RaxRot Bank username has been updated!",
                "Hello " + me.getUserName() + "!\n\n" +
                        "✅ Your username has been successfully changed in RaxRot Bank.\n\n" +
                        "👉 Your new username is: " + newUsername + "\n\n" +
                        "If you did not request this change, please contact our support immediately ⚠️\n\n" +
                        "— RaxRot Bank Security Team 🏦"
        );
    }
    private void sendEmailRemindUsername(User user) {
        emailService.sendEmail(
                user.getEmail(),
                "🔑 Your RaxRot Bank username reminder",
                "Hello!\n\n" +
                        "We received a request to remind you of your RaxRot Bank username.\n\n" +
                        "👉 Your username is: " + user.getUserName() + "\n\n" +
                        "If you did not request this reminder, please ignore this email or contact our support immediately ⚠️\n\n" +
                        "— RaxRot Bank Security Team 🏦"
        );
    }
}
