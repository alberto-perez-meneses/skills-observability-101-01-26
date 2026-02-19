package com.jeager.service_one;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/two")
@Slf4j
public class AppController {

    @GetMapping("")
    public String serviceOne() {
        log.info("Hello from Service two!");
        return "Hello from Service two!";
    }
}