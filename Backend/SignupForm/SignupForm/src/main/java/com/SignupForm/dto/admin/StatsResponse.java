package com.SignupForm.dto.admin;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatsResponse {
    private long totalUsers;
    private long totalAdmins;
    private long totalNormalUsers;
}
