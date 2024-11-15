﻿// <auto-generated />
using System;
using API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace API.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseCollation("Latin1_General_CI_AS")
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("API.Models.Account", b =>
                {
                    b.Property<string>("AccountId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("AccountNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RFC")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Reference")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("AccountId");

                    b.ToTable("Accounts");
                });

            modelBuilder.Entity("API.Models.Bank", b =>
                {
                    b.Property<string>("BankId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("BankId");

                    b.ToTable("Banks");
                });

            modelBuilder.Entity("API.Models.CommercialArea", b =>
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

            modelBuilder.Entity("API.Models.Company", b =>
                {
                    b.Property<string>("CompanyId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int>("TotalWorkers")
                        .HasColumnType("int");

                    b.HasKey("CompanyId");

                    b.ToTable("Companies");
                });

            modelBuilder.Entity("API.Models.Contract", b =>
                {
                    b.Property<string>("ContractId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.HasKey("ContractId");

                    b.ToTable("Contracts");
                });

            modelBuilder.Entity("API.Models.Deduction", b =>
                {
                    b.Property<string>("DeductionId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(75)
                        .HasColumnType("nvarchar(75)");

                    b.Property<bool>("IsHidden")
                        .HasColumnType("bit");

                    b.Property<int>("Key")
                        .HasColumnType("int");

                    b.HasKey("DeductionId");

                    b.ToTable("Deductions");
                });

            modelBuilder.Entity("API.Models.Department", b =>
                {
                    b.Property<string>("DepartmentId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<bool>("SubContract")
                        .HasColumnType("bit");

                    b.Property<int>("TotalEmployees")
                        .HasColumnType("int");

                    b.HasKey("DepartmentId");

                    b.ToTable("Departments");
                });

            modelBuilder.Entity("API.Models.Employee", b =>
                {
                    b.Property<string>("EmployeeId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("BankAccount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("BankId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<decimal>("BankPortal")
                        .HasColumnType("decimal(20,0)");

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

                    b.Property<decimal>("Contact")
                        .HasColumnType("decimal(20,0)");

                    b.Property<string>("ContractId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.Property<long>("Credit")
                        .HasColumnType("bigint");

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

                    b.Property<string>("FederalEntityId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<decimal>("InterbankCode")
                        .HasColumnType("decimal(20,0)");

                    b.Property<bool>("IsAStarter")
                        .HasColumnType("bit");

                    b.Property<bool>("IsProvider")
                        .HasColumnType("bit");

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

                    b.Property<string>("RegimeId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("StateId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("StatusId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Suburb")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<float>("ValuePerExtraHour")
                        .HasColumnType("real");

                    b.HasKey("EmployeeId");

                    b.HasIndex("BankId");

                    b.HasIndex("CommercialAreaId");

                    b.HasIndex("CompanyId");

                    b.HasIndex("ContractId");

                    b.HasIndex("FederalEntityId");

                    b.HasIndex("JobPositionId");

                    b.HasIndex("RegimeId");

                    b.HasIndex("StateId");

                    b.HasIndex("StatusId");

                    b.ToTable("Employees");
                });

            modelBuilder.Entity("API.Models.EmployeeProject", b =>
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

            modelBuilder.Entity("API.Models.FederalEntity", b =>
                {
                    b.Property<string>("FederalEntityId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.HasKey("FederalEntityId");

                    b.ToTable("FederalEntities");
                });

            modelBuilder.Entity("API.Models.JobPosition", b =>
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

            modelBuilder.Entity("API.Models.Payroll", b =>
                {
                    b.Property<string>("PayrollId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("PayrollId");

                    b.ToTable("Payrolls");
                });

            modelBuilder.Entity("API.Models.Perception", b =>
                {
                    b.Property<string>("PerceptionId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(75)
                        .HasColumnType("nvarchar(75)");

                    b.Property<bool>("IsHidden")
                        .HasColumnType("bit");

                    b.Property<int>("Key")
                        .HasColumnType("int");

                    b.HasKey("PerceptionId");

                    b.ToTable("Perceptions");
                });

            modelBuilder.Entity("API.Models.Period", b =>
                {
                    b.Property<string>("PeriodId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<int>("Week")
                        .HasColumnType("int");

                    b.Property<int>("Year")
                        .HasColumnType("int");

                    b.HasKey("PeriodId");

                    b.ToTable("Periods");
                });

            modelBuilder.Entity("API.Models.Project", b =>
                {
                    b.Property<string>("ProjectId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<string>("CompanyId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Description")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("StatusId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.HasKey("ProjectId");

                    b.HasIndex("CompanyId");

                    b.HasIndex("StatusId");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("API.Models.Regime", b =>
                {
                    b.Property<string>("RegimeId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("RegimeId");

                    b.ToTable("Regimes");
                });

            modelBuilder.Entity("API.Models.State", b =>
                {
                    b.Property<string>("StateId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

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

            modelBuilder.Entity("API.Models.Status", b =>
                {
                    b.Property<string>("StatusId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.Property<string>("StatusType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("StatusId");

                    b.ToTable("Statuses");
                });

            modelBuilder.Entity("API.Models.TableWork", b =>
                {
                    b.Property<string>("TableWorkId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Cta")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("Friday")
                        .HasColumnType("real");

                    b.Property<float>("Monday")
                        .HasColumnType("real");

                    b.Property<string>("Observations")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("Saturday")
                        .HasColumnType("real");

                    b.Property<string>("StsR")
                        .IsRequired()
                        .HasMaxLength(1)
                        .HasColumnType("nvarchar(1)");

                    b.Property<string>("StsTr")
                        .IsRequired()
                        .HasMaxLength(1)
                        .HasColumnType("nvarchar(1)");

                    b.Property<float>("Sunday")
                        .HasColumnType("real");

                    b.Property<float>("Thursday")
                        .HasColumnType("real");

                    b.Property<string>("TicketId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<float>("Tuesday")
                        .HasColumnType("real");

                    b.Property<float>("Wednesday")
                        .HasColumnType("real");

                    b.HasKey("TableWorkId");

                    b.HasIndex("TicketId");

                    b.ToTable("TableWorks");
                });

            modelBuilder.Entity("API.Models.Ticket", b =>
                {
                    b.Property<string>("TicketId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<int>("Bill")
                        .HasColumnType("int");

                    b.Property<string>("Company")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Department")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EmployeeId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("JobPosition")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Observations")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("PaymentDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("PayrollType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PeriodId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("Projects")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("ReceiptOfDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Serie")
                        .IsRequired()
                        .HasMaxLength(1)
                        .HasColumnType("nvarchar(1)");

                    b.Property<string>("StatusId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<float>("Total")
                        .HasColumnType("real");

                    b.Property<float>("TotalDeductions")
                        .HasColumnType("real");

                    b.Property<float>("TotalPerceptions")
                        .HasColumnType("real");

                    b.HasKey("TicketId");

                    b.HasIndex("EmployeeId");

                    b.HasIndex("PeriodId");

                    b.HasIndex("StatusId");

                    b.ToTable("Tickets");
                });

            modelBuilder.Entity("API.Models.TicketDeduction", b =>
                {
                    b.Property<string>("TicketId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("DeductionId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("TicketDeductionId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<float>("Total")
                        .HasColumnType("real");

                    b.HasKey("TicketId", "DeductionId");

                    b.HasIndex("DeductionId");

                    b.ToTable("TicketDeductions");
                });

            modelBuilder.Entity("API.Models.TicketPerception", b =>
                {
                    b.Property<string>("TicketId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("PerceptionId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<string>("TicketPerceptionId")
                        .HasMaxLength(36)
                        .HasColumnType("nvarchar(36)");

                    b.Property<float>("Total")
                        .HasColumnType("real");

                    b.HasKey("TicketId", "PerceptionId");

                    b.HasIndex("PerceptionId");

                    b.ToTable("TicketPerceptions");
                });

            modelBuilder.Entity("API.Models.Employee", b =>
                {
                    b.HasOne("API.Models.Bank", "Bank")
                        .WithMany("Employees")
                        .HasForeignKey("BankId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Models.CommercialArea", "CommercialArea")
                        .WithMany("Employees")
                        .HasForeignKey("CommercialAreaId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Models.Company", "Company")
                        .WithMany("Employees")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("API.Models.Contract", "Contract")
                        .WithMany("Employees")
                        .HasForeignKey("ContractId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Models.FederalEntity", "FederalEntity")
                        .WithMany("Employees")
                        .HasForeignKey("FederalEntityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Models.JobPosition", "JobPosition")
                        .WithMany("Employees")
                        .HasForeignKey("JobPositionId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("API.Models.Regime", "Regime")
                        .WithMany("Employees")
                        .HasForeignKey("RegimeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Models.State", "State")
                        .WithMany("Employees")
                        .HasForeignKey("StateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Models.Status", "Status")
                        .WithMany("Employees")
                        .HasForeignKey("StatusId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Bank");

                    b.Navigation("CommercialArea");

                    b.Navigation("Company");

                    b.Navigation("Contract");

                    b.Navigation("FederalEntity");

                    b.Navigation("JobPosition");

                    b.Navigation("Regime");

                    b.Navigation("State");

                    b.Navigation("Status");
                });

            modelBuilder.Entity("API.Models.EmployeeProject", b =>
                {
                    b.HasOne("API.Models.Employee", "Employee")
                        .WithMany("EmployeeProjects")
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Models.Project", "Project")
                        .WithMany("EmployeeProjects")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Employee");

                    b.Navigation("Project");
                });

            modelBuilder.Entity("API.Models.JobPosition", b =>
                {
                    b.HasOne("API.Models.Department", "Department")
                        .WithMany("JobPositions")
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Department");
                });

            modelBuilder.Entity("API.Models.Project", b =>
                {
                    b.HasOne("API.Models.Company", "Company")
                        .WithMany("Projects")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("API.Models.Status", "Status")
                        .WithMany("Projects")
                        .HasForeignKey("StatusId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Company");

                    b.Navigation("Status");
                });

            modelBuilder.Entity("API.Models.TableWork", b =>
                {
                    b.HasOne("API.Models.Ticket", "Ticket")
                        .WithMany("TableWorks")
                        .HasForeignKey("TicketId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Ticket");
                });

            modelBuilder.Entity("API.Models.Ticket", b =>
                {
                    b.HasOne("API.Models.Employee", "Employee")
                        .WithMany("Tickets")
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Models.Period", "Period")
                        .WithMany("Tickets")
                        .HasForeignKey("PeriodId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Models.Status", "Status")
                        .WithMany("Tickets")
                        .HasForeignKey("StatusId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Employee");

                    b.Navigation("Period");

                    b.Navigation("Status");
                });

            modelBuilder.Entity("API.Models.TicketDeduction", b =>
                {
                    b.HasOne("API.Models.Deduction", "Deduction")
                        .WithMany("TicketDeductions")
                        .HasForeignKey("DeductionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Models.Ticket", "Ticket")
                        .WithMany("TicketDeductions")
                        .HasForeignKey("TicketId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Deduction");

                    b.Navigation("Ticket");
                });

            modelBuilder.Entity("API.Models.TicketPerception", b =>
                {
                    b.HasOne("API.Models.Perception", "Perception")
                        .WithMany("TicketPerceptions")
                        .HasForeignKey("PerceptionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Models.Ticket", "Ticket")
                        .WithMany("TicketPerceptions")
                        .HasForeignKey("TicketId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Perception");

                    b.Navigation("Ticket");
                });

            modelBuilder.Entity("API.Models.Bank", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("API.Models.CommercialArea", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("API.Models.Company", b =>
                {
                    b.Navigation("Employees");

                    b.Navigation("Projects");
                });

            modelBuilder.Entity("API.Models.Contract", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("API.Models.Deduction", b =>
                {
                    b.Navigation("TicketDeductions");
                });

            modelBuilder.Entity("API.Models.Department", b =>
                {
                    b.Navigation("JobPositions");
                });

            modelBuilder.Entity("API.Models.Employee", b =>
                {
                    b.Navigation("EmployeeProjects");

                    b.Navigation("Tickets");
                });

            modelBuilder.Entity("API.Models.FederalEntity", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("API.Models.JobPosition", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("API.Models.Perception", b =>
                {
                    b.Navigation("TicketPerceptions");
                });

            modelBuilder.Entity("API.Models.Period", b =>
                {
                    b.Navigation("Tickets");
                });

            modelBuilder.Entity("API.Models.Project", b =>
                {
                    b.Navigation("EmployeeProjects");
                });

            modelBuilder.Entity("API.Models.Regime", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("API.Models.State", b =>
                {
                    b.Navigation("Employees");
                });

            modelBuilder.Entity("API.Models.Status", b =>
                {
                    b.Navigation("Employees");

                    b.Navigation("Projects");

                    b.Navigation("Tickets");
                });

            modelBuilder.Entity("API.Models.Ticket", b =>
                {
                    b.Navigation("TableWorks");

                    b.Navigation("TicketDeductions");

                    b.Navigation("TicketPerceptions");
                });
#pragma warning restore 612, 618
        }
    }
}
