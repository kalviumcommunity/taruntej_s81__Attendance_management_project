package com.school;
import java.util.*;

public class Student extends Person {
    private String gradeLevel;

    public Student(String name, String gradeLevel) {
        super(name);
        this.gradeLevel = gradeLevel;
    }

    @Override
    public void displayDetails() {
        super.displayDetails();
        System.out.println("Grade Level: " + gradeLevel);
        System.out.println("Role: Student");
    }
}
