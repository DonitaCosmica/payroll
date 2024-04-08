﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Payroll.Data;

#nullable disable

namespace API.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20240408200235_PayrollMigration")]
    partial class PayrollMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Payroll.Models.Bank", b =>
                {
                    b.Property<byte>("BankId")
                        .HasColumnType("tinyint");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("BankId");

                    b.ToTable("Banks");
                });

            modelBuilder.Entity("Payroll.Models.CommercialArea", b =>
                {
                    b.Property<string>("CommercialAreaId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.HasKey("CommercialAreaId");

                    b.ToTable("CommercialAreas");
                });

            modelBuilder.Entity("Payroll.Models.Company", b =>
                {
                    b.Property<string>("CompanyId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("CompanyId");

                    b.ToTable("Companies");
                });

            modelBuilder.Entity("Payroll.Models.Deduction", b =>
                {
                    b.Property<string>("DeductionId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<bool>("IsHidden")
                        .HasColumnType("bit");

                    b.Property<int>("Key")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("DeductionId");

                    b.ToTable("Deductions");
                });

            modelBuilder.Entity("Payroll.Models.Department", b =>
                {
                    b.Property<string>("DepartmentId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<long>("TotalEmployees")
                        .HasColumnType("bigint");

                    b.HasKey("DepartmentId");

                    b.ToTable("Departments");
                });

            modelBuilder.Entity("Payroll.Models.Employee", b =>
                {
                    b.Property<string>("EmployeeId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<byte>("BankId")
                        .HasMaxLength(36)
                        .HasColumnType("tinyint");

                    b.Property<float>("BaseSalary")
                        .HasColumnType("real");

                    b.Property<string>("CURP")
                        .IsRequired()
                        .HasMaxLength(18)
                        .HasColumnType("nvarchar(18)");

                    b.Property<string>("City")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("CommercialAreaId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("CompanyId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<float>("DailySalary")
                        .HasColumnType("real");

                    b.Property<DateTime>("DateAdmission")
                        .HasColumnType("datetime2");

                    b.Property<string>("Direction")
                        .HasMaxLength(75)
                        .HasColumnType("nvarchar(75)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("InterbankCode")
                        .HasColumnType("decimal(20,0)");

                    b.Property<string>("JobPositionId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<int>("Key")
                        .HasColumnType("int");

                    b.Property<long>("NSS")
                        .HasColumnType("bigint");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<decimal>("Phone")
                        .HasColumnType("decimal(20,0)");

                    b.Property<int>("PostalCode")
                        .HasColumnType("int");

                    b.Property<string>("RFC")
                        .IsRequired()
                        .HasMaxLength(13)
                        .HasColumnType("nvarchar(13)");

                    b.Property<int>("StateId")
                        .HasColumnType("int");

                    b.Property<byte>("StatusId")
                        .HasColumnType("tinyint");

                    b.HasKey("EmployeeId");

                    b.HasIndex("BankId");

                    b.HasIndex("CommercialAreaId");

                    b.HasIndex("CompanyId");

                    b.HasIndex("JobPositionId");

                    b.HasIndex("StateId");

                    b.HasIndex("StatusId");

                    b.ToTable("Employees");
                });

            modelBuilder.Entity("Payroll.Models.EmployeeProject", b =>
                {
                    b.Property<string>("EmployeeId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("ProjectId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<DateTime>("AssignedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("EmployeeProjectId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.HasKey("EmployeeId", "ProjectId");

                    b.HasIndex("ProjectId");

                    b.ToTable("EmployeeProjects");
                });

            modelBuilder.Entity("Payroll.Models.JobPosition", b =>
                {
                    b.Property<string>("JobPositionId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("DepartmentId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.HasKey("JobPositionId");

                    b.HasIndex("DepartmentId");

                    b.ToTable("JobPositions");
                });

            modelBuilder.Entity("Payroll.Models.Perception", b =>
                {
                    b.Property<string>("PerceptionId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<bool>("IsHidden")
                        .HasColumnType("bit");

                    b.Property<int>("Key")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("PerceptionId");

                    b.ToTable("Perceptions");
                });

            modelBuilder.Entity("Payroll.Models.Project", b =>
                {
                    b.Property<string>("ProjectId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<byte>("StatusId")
                        .HasColumnType("tinyint");

                    b.HasKey("ProjectId");

                    b.HasIndex("StatusId");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("Payroll.Models.State", b =>
                {
                    b.Property<int>("StateId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("StateId"));

                    b.Property<string>("Abbreviation")
                        .IsRequired()
                        .HasMaxLength(6)
                        .HasColumnType("nvarchar(6)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("StateId");

                    b.ToTable("States");
                });

            modelBuilder.Entity("Payroll.Models.Status", b =>
                {
                    b.Property<byte>("StatusId")
                        .HasColumnType("tinyint");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.HasKey("StatusId");

                    b.ToTable("Statuses");
                });

            modelBuilder.Entity("Payroll.Models.Ticket", b =>
                {
                    b.Property<string>("TicketId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.HasKey("TicketId");

                    b.ToTable("Tickets");
                });

            modelBuilder.Entity("Payroll.Models.Employee", b =>
                {
                    b.HasOne("Payroll.Models.Bank", "Bank")
                        .WithMany("Employees")
                        .HasForeignKey("BankId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Payroll.Models.CommercialArea", "CommercialArea")
                        .WithMany("Employees")
                        .HasForeignKey("CommercialAreaId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Payroll.Models.Company", "Company")
                        .WithMany("Employees")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Payroll.Models.JobPosition", "JobPosition")
                        .WithMany("Employees")
                        .HasForeignKey("JobPositionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Payroll.Models.State", "State")
                        .WithMany("Employees")
                        .HasForeignKey("StateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Payroll.Models.Status", "Status")
                        .WithMany("Employees")
                        .HasForeignKey("StatusId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Bank");

                    b.Navigation("CommercialArea");

                    b.Navigation("Company");

                    b.Navigation("JobPosition");

                    b.Navigation("State");

                    b.Navigation("Status");
                });

            modelBuilder.Entity("Payroll.Models.EmployeeProject", b =>
                {
                    b.HasOne("Payroll.Models.Employee", "Employee")
                        .WithMany("EmployeeProjects")
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Payroll.Models.Project", "Project")
                        .WithMany("EmployeeProjects")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Employee");

                    b.Navigation("Project");
                });

            modelBuilder.Entity("Payroll.Models.JobPosition", b =>
                {
                    b.HasOne("Payroll.Models.Department", "Department")
                        .WithMany("JobPositions")
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Department");
                });

            modelBuilder.Entity("Payroll.Models.Project", b =>
                {
                    b.HasOne("Payroll.Models.Status", "Status")
                        .WithMany("Projects")
                        .HasForeignKey("StatusId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Status");
                });

            modelBuilder.Entity("Payroll.Models.Bank", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("Payroll.Models.CommercialArea", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("Payroll.Models.Company", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("Payroll.Models.Department", b =>
                {
                    b.Navigation("JobPositions");
                });

            modelBuilder.Entity("Payroll.Models.Employee", b =>
                {
                    b.Navigation("EmployeeProjects");
                });

            modelBuilder.Entity("Payroll.Models.JobPosition", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("Payroll.Models.Project", b =>
                {
                    b.Navigation("EmployeeProjects");
                });

            modelBuilder.Entity("Payroll.Models.State", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("Payroll.Models.Status", b =>
                {
                    b.Navigation("Employees");

                    b.Navigation("Projects");
                });
#pragma warning restore 612, 618
        }
    }
}
