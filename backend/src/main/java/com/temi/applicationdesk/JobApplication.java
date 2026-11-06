package com.temi.applicationdesk;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record JobApplication(
    String id,

    @NotBlank
    @Size(max = 200)
    String company,

    @NotBlank
    @Size(max = 200)
    String role,

    @NotBlank
    @Pattern(regexp = "Saved|Applied|Interview|Offer|Closed")
    String status
) {
}