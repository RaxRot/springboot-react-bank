package com.raxrot.back.services;

import com.raxrot.back.dtos.AdminUserFullResponse;
import com.raxrot.back.dtos.AdminUserPageResponse;
import com.raxrot.back.dtos.AdminUserResponse;

public interface AdminUserService {
    AdminUserPageResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    AdminUserFullResponse getUserById(Long id);
    AdminUserResponse updateToSuperUser(Long userId);
    AdminUserResponse removeSuperUser(Long userId);
}
