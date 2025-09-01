package com.raxrot.back.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserFullResponse{
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
    private List<AccountResponse> accounts;
}
