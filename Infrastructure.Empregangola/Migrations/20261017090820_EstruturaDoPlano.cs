using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    /// <inheritdoc />
    public partial class EstruturaDoPlano : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PremiumServices",
                columns: table => new
                {
                    PremiumServiceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DurationInDays = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PremiumServices", x => x.PremiumServiceId);
                });

            migrationBuilder.CreateTable(
                name: "PremiumSubscriptions",
                columns: table => new
                {
                    PremiumSubscriptionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PremiumServiceId = table.Column<int>(type: "int", nullable: false),
                    AppUserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PremiumSubscriptions", x => x.PremiumSubscriptionId);
                    table.ForeignKey(
                        name: "FK_PremiumSubscriptions_PremiumServices_PremiumServiceId",
                        column: x => x.PremiumServiceId,
                        principalTable: "PremiumServices",
                        principalColumn: "PremiumServiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PremiumVacancies",
                columns: table => new
                {
                    PremiumVacancyId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VacancyId = table.Column<int>(type: "int", nullable: false),
                    PremiumSubscriptionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PremiumVacancies", x => x.PremiumVacancyId);
                    table.ForeignKey(
                        name: "FK_PremiumVacancies_PremiumSubscriptions_PremiumSubscriptionId",
                        column: x => x.PremiumSubscriptionId,
                        principalTable: "PremiumSubscriptions",
                        principalColumn: "PremiumSubscriptionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PremiumVacancies_Vacancies_VacancyId",
                        column: x => x.VacancyId,
                        principalTable: "Vacancies",
                        principalColumn: "VacanciesId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PremiumSubscriptions_PremiumServiceId",
                table: "PremiumSubscriptions",
                column: "PremiumServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_PremiumVacancies_PremiumSubscriptionId",
                table: "PremiumVacancies",
                column: "PremiumSubscriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_PremiumVacancies_VacancyId",
                table: "PremiumVacancies",
                column: "VacancyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PremiumVacancies");

            migrationBuilder.DropTable(
                name: "PremiumSubscriptions");

            migrationBuilder.DropTable(
                name: "PremiumServices");
        }
    }
}
