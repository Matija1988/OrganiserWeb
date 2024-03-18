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


    public record ProofDTORead(int id, string? documentName, string? member, string? location, 
        DateTime? datecreated, string activity);

    public record ProofDTOInsertUpdate(string? documentName, int? member, string? location,
        DateTime? datecreated, int activity);

    public record ActivityDTORead(int id,  string activityname, string? description, DateTime datestart, DateTime datefinished,
        bool? isFinished, DateTime? dateaccepted, string project);


    public record ActivityDTOInsertUpdate( string activityname, string? description, DateTime datestart, DateTime datefinished,
        bool? isFinished, DateTime? dateaccepted, int? project);



}
