package com.raxrot.back.controllers;

import com.raxrot.back.configs.AppConstants;
import com.raxrot.back.dtos.AdminUserFullResponse;
import com.raxrot.back.dtos.AdminUserPageResponse;
import com.raxrot.back.dtos.AdminUserResponse;
import com.raxrot.back.services.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<AdminUserPageResponse> getAlUsers(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name="sortBy", defaultValue = AppConstants.SORT_USERS_BY) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        AdminUserPageResponse adminUserResponse =
                adminUserService.getAllUsers(pageNumber, pageSize, sortBy, sortOrder);
        return ResponseEntity.ok(adminUserResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserFullResponse> getAdminUserById(@PathVariable Long id) {
        AdminUserFullResponse adminUserFullResponse=adminUserService.getUserById(id);
        return ResponseEntity.ok(adminUserFullResponse);
    }

    @PatchMapping("/{id}/roles/super-user")
    public ResponseEntity<AdminUserResponse> promoteToSuperUser(@PathVariable Long id) {
        AdminUserResponse resp = adminUserService.updateToSuperUser(id);
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{id}/roles/super-user")
    public ResponseEntity<AdminUserResponse> removeSuperUser(@PathVariable Long id) {
        AdminUserResponse resp = adminUserService.removeSuperUser(id);
        return ResponseEntity.ok(resp);
    }
}
