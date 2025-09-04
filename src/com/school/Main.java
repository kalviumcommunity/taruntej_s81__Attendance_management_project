package com.school;

public class Main {
    public static void main(String[] args) {
        Student[] stu = new Student[2];
        stu[0] = new Student(1, "Raki");
        stu[1] = new Student(2, "Raki2");

        for (Student s : stu) {
            s.displayDetails();
        }

        Course[] courses = new Course[2];
        courses[0] = new Course();
        courses[0].setDetails(101, "Mathematics");
        courses[1] = new Course();
        courses[1].setDetails(102, "Science");

        for (Course c : courses) {
            c.displayDetails();
        }
    }
}
