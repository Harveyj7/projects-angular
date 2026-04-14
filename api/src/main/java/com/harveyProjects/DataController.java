package com.harveyProjects;

import java.time.*;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class DataController {

    @GetMapping("/hello")
    public Map<String, String> sayHello() {
        System.out.println("Hello from Spring Boot!");
        var currentYear = LocalDate.now().getYear();
        return Collections.singletonMap("message", "Hello from Spring Boot!" + currentYear);
    }
}