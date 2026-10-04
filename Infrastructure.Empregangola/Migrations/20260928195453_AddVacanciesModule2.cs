using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    /// <inheritdoc />
    public partial class AddVacanciesModule2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VacancyLanguages_Languages",
                table: "VacancyLanguages");

            migrationBuilder.DropForeignKey(
                name: "FK_VacancyLanguages_Vacancies",
                table: "VacancyLanguages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_VacancyLanguages",
                table: "VacancyLanguages");

            migrationBuilder.DropIndex(
                name: "IX_VacancyLanguages_VacancyId",
                table: "VacancyLanguages");

            migrationBuilder.DropColumn(
                name: "ExperienceLevel",
                table: "Vacancies");

            migrationBuilder.DropColumn(
                name: "MunicipalityId",
                table: "Vacancies");

            migrationBuilder.AlterColumn<int>(
                name: "WorkMode",
                table: "Vacancies",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Vacancies",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "Municipality",
                table: "Vacancies",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "EducationLevel",
                table: "Vacancies",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<int>(
                name: "ContractType",
                table: "Vacancies",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(30)",
                oldMaxLength: 30);

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationTarget",
                table: "Vacancies",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<int>(
                name: "ApplicationMethod",
                table: "Vacancies",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AddColumn<int>(
                name: "MinimumExperience",
                table: "Vacancies",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyInterestId",
                table: "CompanyInterest",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_VacancyLanguages",
                table: "VacancyLanguages",
                columns: new[] { "VacancyId", "LanguageId" });

            migrationBuilder.CreateIndex(
                name: "IX_VacancyLanguages_LanguageId",
                table: "VacancyLanguages",
                column: "LanguageId");

            migrationBuilder.AddForeignKey(
                name: "FK_VacancyLanguages_Languages_LanguageId",
                table: "VacancyLanguages",
                column: "LanguageId",
                principalTable: "Languages",
                principalColumn: "LanguagesId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VacancyLanguages_Vacancies_VacancyId",
                table: "VacancyLanguages",
                column: "VacancyId",
                principalTable: "Vacancies",
                principalColumn: "VacanciesId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VacancyLanguages_Languages_LanguageId",
                table: "VacancyLanguages");

            migrationBuilder.DropForeignKey(
                name: "FK_VacancyLanguages_Vacancies_VacancyId",
                table: "VacancyLanguages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_VacancyLanguages",
                table: "VacancyLanguages");

            migrationBuilder.DropIndex(
                name: "IX_VacancyLanguages_LanguageId",
                table: "VacancyLanguages");

            migrationBuilder.DropColumn(
                name: "MinimumExperience",
                table: "Vacancies");

            migrationBuilder.AlterColumn<string>(
                name: "WorkMode",
                table: "Vacancies",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Vacancies",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Municipality",
                table: "Vacancies",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "EducationLevel",
                table: "Vacancies",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "ContractType",
                table: "Vacancies",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationTarget",
                table: "Vacancies",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationMethod",
                table: "Vacancies",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "ExperienceLevel",
                table: "Vacancies",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MunicipalityId",
                table: "Vacancies",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CompanyInterestId",
                table: "CompanyInterest",
                type: "int",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier")
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_VacancyLanguages",
                table: "VacancyLanguages",
                columns: new[] { "LanguageId", "VacancyId" });

            migrationBuilder.CreateIndex(
                name: "IX_VacancyLanguages_VacancyId",
                table: "VacancyLanguages",
                column: "VacancyId");

            migrationBuilder.AddForeignKey(
                name: "FK_VacancyLanguages_Languages",
                table: "VacancyLanguages",
                column: "LanguageId",
                principalTable: "Languages",
                principalColumn: "LanguagesId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VacancyLanguages_Vacancies",
                table: "VacancyLanguages",
                column: "VacancyId",
                principalTable: "Vacancies",
                principalColumn: "VacanciesId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
