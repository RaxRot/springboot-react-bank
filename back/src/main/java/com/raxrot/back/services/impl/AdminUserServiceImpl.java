package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.AccountResponse;
import com.raxrot.back.dtos.AdminUserFullResponse;
import com.raxrot.back.dtos.AdminUserPageResponse;
import com.raxrot.back.dtos.AdminUserResponse;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.AppRole;
import com.raxrot.back.models.Role;
import com.raxrot.back.models.User;
import com.raxrot.back.repositories.RoleRepository;
import com.raxrot.back.repositories.UserRepository;
import com.raxrot.back.services.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public AdminUserPageResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        Page<User> users = userRepository.findAll(pageDetails);

        List<AdminUserResponse> content = users.getContent().stream()
                .map(user -> new AdminUserResponse(
                        user.getUserId(),
                        user.getUserName(),
                        user.getEmail(),
                        user.getRoles().stream()
                                .map(r -> r.getRoleName().name())
                                .toList()
                ))
                .toList();

        return new AdminUserPageResponse(
                content,
                users.getNumber(),
                users.getSize(),
                users.getTotalPages(),
                users.getTotalElements(),
                users.isLast()
        );
    }

    @Override
    public AdminUserFullResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User Not Found", HttpStatus.NOT_FOUND));

        List<AccountResponse> accounts = user.getAccounts().stream()
                .map(acc -> {
                    AccountResponse dto = new AccountResponse();
                    dto.setId(acc.getId());
                    dto.setCurrencyType(acc.getCurrencyType());
                    dto.setBalance(acc.getBalance());
                    dto.setIban(acc.getIban());
                    dto.setSwiftCode(acc.getSwiftCode());
                    return dto;
                })
                .toList();

        List<String> roles = user.getRoles().stream()
                .map(r -> r.getRoleName().name())
                .toList();

        AdminUserFullResponse resp = new AdminUserFullResponse();
        resp.setId(user.getUserId());
        resp.setUsername(user.getUserName());
        resp.setEmail(user.getEmail());
        resp.setRoles(roles);
        resp.setAccounts(accounts);
        return resp;
    }

    @Override
    public AdminUserResponse updateToSuperUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        Role superRole = roleRepository.findByRoleName(AppRole.ROLE_SUPER_USER)
                .orElseThrow(() -> new ApiException("ROLE_SUPER_USER not found in DB", HttpStatus.INTERNAL_SERVER_ERROR));

        if (user.getRoles().stream().noneMatch(r -> r.getRoleName() == AppRole.ROLE_SUPER_USER)) {
            user.getRoles().add(superRole);
            user = userRepository.save(user);
        }

        return new AdminUserResponse(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getRoles().stream()
                        .map(r -> r.getRoleName().name())
                        .toList()
        );
    }

    @Override
    public AdminUserResponse removeSuperUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        Role superRole = roleRepository.findByRoleName(AppRole.ROLE_SUPER_USER)
                .orElseThrow(() -> new ApiException("ROLE_SUPER_USER not found in DB", HttpStatus.INTERNAL_SERVER_ERROR));

        if (user.getRoles().stream().anyMatch(r -> r.getRoleName() == AppRole.ROLE_SUPER_USER)) {
            user.getRoles().remove(superRole);
            user = userRepository.save(user);
        } else {
            throw new ApiException("User doesn't have role ROLE_SUPER_USER", HttpStatus.CONFLICT);
        }

        return new AdminUserResponse(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getRoles().stream()
                        .map(r -> r.getRoleName().name())
                        .toList()
        );
    }
}
