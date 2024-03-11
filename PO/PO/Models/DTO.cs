using PO.Models;

namespace PO.Models
{
    public record ProjectDTORead(int Id, string UniqueID, string ProjectName, 
        DateTime DateStart, DateTime DateEnd, bool IsFinished);

    public record ProjectDTOInsertUpdate(string UniqueID, string ProjectName,
        DateTime DateStart, DateTime DateEnd, bool IsFinished);

    public record MemberDTORead(int Id, string FirstName, string LastName, 
        string Username, string Password, bool IsTeamLeader);
    /// <summary>
    /// 
    /// </summary>
    /// <param name="FirstName"></param>
    /// <param name="LastName"></param>
    /// <param name="Username"></param>
    /// <param name="Password"></param>
    /// <param name="IsTeamLeader"></param>
    public record MemberDTOInsertUpdate(int id, string FirstName, string LastName,
        string Username, string Password, bool IsTeamLeader);
}


//public static ProjectDTOInsertUpdate Create(string UniqueID, string ProjectName,
//    DateTime DateStart, DateTime DateEnd, bool IsFinished)
//    => new(UniqueID, ProjectName, DateStart, DateEnd, IsFinished);