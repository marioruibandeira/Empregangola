using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Empregangola.Migrations
{
    /// <inheritdoc />
    public partial class alteracaoDoCampoPosition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Company_Interest_InterestId1",
                table: "Company");

            migrationBuilder.DropForeignKey(
                name: "FK_Company_Position_PositionId1",
                table: "Company");

            migrationBuilder.DropIndex(
                name: "IX_Company_InterestId1",
                table: "Company");

            migrationBuilder.DropIndex(
                name: "IX_Company_PositionId1",
                table: "Company");

            migrationBuilder.DropColumn(
                name: "InterestId",
                table: "Company");

            migrationBuilder.DropColumn(
                name: "InterestId1",
                table: "Company");

            migrationBuilder.DropColumn(
                name: "PositionId",
                table: "Company");

            migrationBuilder.DropColumn(
                name: "PositionId1",
                table: "Company");

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "Company",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Position",
                table: "Company");

            migrationBuilder.AddColumn<bool>(
                name: "InterestId",
                table: "Company",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "InterestId1",
                table: "Company",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "PositionId",
                table: "Company",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "PositionId1",
                table: "Company",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Company_InterestId1",
                table: "Company",
                column: "InterestId1");

            migrationBuilder.CreateIndex(
                name: "IX_Company_PositionId1",
                table: "Company",
                column: "PositionId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Company_Interest_InterestId1",
                table: "Company",
                column: "InterestId1",
                principalTable: "Interest",
                principalColumn: "InterestId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Company_Position_PositionId1",
                table: "Company",
                column: "PositionId1",
                principalTable: "Position",
                principalColumn: "PositionId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
