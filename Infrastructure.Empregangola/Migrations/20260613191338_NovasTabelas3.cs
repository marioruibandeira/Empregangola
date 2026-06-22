using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    /// <inheritdoc />
    public partial class NovasTabelas3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaisTable");

            migrationBuilder.CreateTable(
                name: "ActivitySector",
                columns: table => new
                {
                    ActivitySectorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ActivitySector = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivitySector", x => x.ActivitySectorId);
                });

            migrationBuilder.CreateTable(
                name: "Country",
                columns: table => new
                {
                    PaidId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Pais = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Sigla = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Country", x => x.PaidId);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeCount",
                columns: table => new
                {
                    EmployeeCountId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmployeeCount = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeCount", x => x.EmployeeCountId);
                });

            migrationBuilder.CreateTable(
                name: "Interest",
                columns: table => new
                {
                    InterestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Interest = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Interest", x => x.InterestId);
                });

            migrationBuilder.CreateTable(
                name: "Position",
                columns: table => new
                {
                    PositionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Position = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Position", x => x.PositionId);
                });

            migrationBuilder.CreateTable(
                name: "Company",
                columns: table => new
                {
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TaxNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ActivitySectorId = table.Column<int>(type: "int", nullable: false),
                    ActivitySectorId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmployeeCountId = table.Column<int>(type: "int", nullable: false),
                    EmployeeCountId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CountryId = table.Column<int>(type: "int", nullable: false),
                    CountryPaidId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Provincy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Municipality = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PersonResponsible = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PositionId = table.Column<int>(type: "int", nullable: false),
                    PositionId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CorporateEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InterestId = table.Column<bool>(type: "bit", nullable: false),
                    InterestId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AboutCompany = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company", x => x.CompanyId);
                    table.ForeignKey(
                        name: "FK_Company_ActivitySector_ActivitySectorId1",
                        column: x => x.ActivitySectorId1,
                        principalTable: "ActivitySector",
                        principalColumn: "ActivitySectorId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Company_Country_CountryPaidId",
                        column: x => x.CountryPaidId,
                        principalTable: "Country",
                        principalColumn: "PaidId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Company_EmployeeCount_EmployeeCountId1",
                        column: x => x.EmployeeCountId1,
                        principalTable: "EmployeeCount",
                        principalColumn: "EmployeeCountId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Company_Interest_InterestId1",
                        column: x => x.InterestId1,
                        principalTable: "Interest",
                        principalColumn: "InterestId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Company_Position_PositionId1",
                        column: x => x.PositionId1,
                        principalTable: "Position",
                        principalColumn: "PositionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CompanyInterest",
                columns: table => new
                {
                    CompanyInterestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AppUserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InterestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyInterest", x => x.CompanyInterestId);
                    table.ForeignKey(
                        name: "FK_CompanyInterest_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CompanyInterest_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "CompanyId");
                    table.ForeignKey(
                        name: "FK_CompanyInterest_Interest_InterestId",
                        column: x => x.InterestId,
                        principalTable: "Interest",
                        principalColumn: "InterestId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Company_ActivitySectorId1",
                table: "Company",
                column: "ActivitySectorId1");

            migrationBuilder.CreateIndex(
                name: "IX_Company_CompanyId",
                table: "Company",
                column: "CompanyId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Company_CountryPaidId",
                table: "Company",
                column: "CountryPaidId");

            migrationBuilder.CreateIndex(
                name: "IX_Company_EmployeeCountId1",
                table: "Company",
                column: "EmployeeCountId1");

            migrationBuilder.CreateIndex(
                name: "IX_Company_InterestId1",
                table: "Company",
                column: "InterestId1");

            migrationBuilder.CreateIndex(
                name: "IX_Company_PositionId1",
                table: "Company",
                column: "PositionId1");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyInterest_AppUserId",
                table: "CompanyInterest",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyInterest_CompanyId",
                table: "CompanyInterest",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyInterest_InterestId",
                table: "CompanyInterest",
                column: "InterestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyInterest");

            migrationBuilder.DropTable(
                name: "Company");

            migrationBuilder.DropTable(
                name: "ActivitySector");

            migrationBuilder.DropTable(
                name: "Country");

            migrationBuilder.DropTable(
                name: "EmployeeCount");

            migrationBuilder.DropTable(
                name: "Interest");

            migrationBuilder.DropTable(
                name: "Position");

            migrationBuilder.CreateTable(
                name: "PaisTable",
                columns: table => new
                {
                    PaidId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Pais = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Sigla = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaisTable", x => x.PaidId);
                });
        }
    }
}
