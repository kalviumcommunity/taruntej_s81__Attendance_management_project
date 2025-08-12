package com.school;


public class Course {
    private int courseId;
    private String courseName;
    private static int nextCourseIdCounter = 1;

    public Course(String courseName){
        this.courseName = courseName;
        this.courseId = nextCourseIdCounter++;
    }

    public void displayDetails() {
        System.out.println("Course Name: " + courseName);
        System.out.println("Course Id: " + courseId);
    }
}