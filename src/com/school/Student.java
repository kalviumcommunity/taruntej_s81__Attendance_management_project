package com.school;


public class Student {
    private int studentId;
    private String name;
    private static int nextStudentIdCounter = 1;
    
    public Student(String name){
        studentId = nextStudentIdCounter++;
        this.name = name;
    }
    

    public void displayDetails() {
        System.out.println("Name: " + name);
        System.out.println("Student Id: " + studentId);
    }
}