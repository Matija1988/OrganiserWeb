using PO.Models;
using System.ComponentModel.DataAnnotations;

namespace PO.Models
{
    public record ProjectDTORead(int Id, string UniqueID, string ProjectName, 
        DateTime DateStart, DateTime DateEnd, bool? IsFinished);

    public record ProjectDTOInsertUpdate(
        [Required(ErrorMessage = "Mandatory input")]
        string UniqueID,
        [Required(ErrorMessage = "Mandatory input")]
        string ProjectName,
        [Required(ErrorMessage = "Mandatory input")]
        DateTime DateStart,
        [Required(ErrorMessage = "Mandatory input")]
        DateTime DateEnd,
        [Required(ErrorMessage = "Mandatory input")]
        bool? IsFinished);

    public record MemberDTORead(int Id, string FirstName, string LastName, 
        string Username, string Password, string Email, bool IsTeamLeader);
    /// <summary>
    /// 
    /// </summary>
    /// <param name="FirstName"></param>
    /// <param name="LastName"></param>
    /// <param name="Username"></param>
    /// <param name="Password"></param>
    /// <param name="Email"></param>
    /// <param name="IsTeamLeader"></param>
    public record MemberDTOInsertUpdate(int id, string FirstName, string LastName,
        string Username, string Password, string Email, bool IsTeamLeader);


    public record ProofDTORead(int id, string? documentName, string? memberName, string? location, 
        DateTime? datecreated, string? activityName);

    public record ProofDTOInsertUpdate(string? documentName, int? memberID, string? location,
        DateTime? datecreated, int? activityID);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="ID"></param>
    /// <param name="ActivityName"></param>
    /// <param name="Description"></param>
    /// <param name="DateStart"></param>
    /// <param name="DateFinished"></param>
    /// <param name="IsFinished"></param>
    /// <param name="DateAccepted"></param>
    /// <param name="ProjectName"></param>
    public record ActivityDTORead(int ID,  string ActivityName, string? ActivityDescription, DateTime DateStart, 
        DateTime DateFinish,bool? IsFinished, DateTime? DateAccepted, string ProjectName);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="ActivityName"></param>
    /// <param name="Description"></param>
    /// <param name="DateStart"></param>
    /// <param name="DateFinished"></param>
    /// <param name="IsFinished"></param>
    /// <param name="DateAccepted"></param>
    /// <param name="Project"></param>
    public record ActivityDTOInsertUpdate(string ActivityName, string? Description, DateTime DateStart,
        DateTime DateFinish, bool? IsFinished, DateTime? DateAccepted, int ProjectID);



}