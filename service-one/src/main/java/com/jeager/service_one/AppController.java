package com.jeager.service_one;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/one")
public class AppController {

    @GetMapping("")
    public String serviceOne() {
        return "Hello from Service One!";
    }
}