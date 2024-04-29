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
    public record MemberDTOInsertUpdate(
        [Required(ErrorMessage ="Mandatory input")]
        string FirstName,
        [Required(ErrorMessage ="Mandatory input")]
        string LastName,
        [Required(ErrorMessage ="Mandatory input")]
        string Username,
        [Required(ErrorMessage ="Mandatory input")]
        string Password,
        [Required(ErrorMessage ="Improper format")]
        string Email,
        [Required(ErrorMessage ="Mandatory input")]
        bool IsTeamLeader);


    public record ProofDTORead(int id, string? documentName, string? memberName, string? location, 
        DateTime? datecreated, string? activityName);

    public record ProofDTOInsertUpdate(
        [Required(ErrorMessage ="Mandatory input")]
        string documentName, 
        int? memberID, 
        string? location,
        DateTime? datecreated,
        [Required(ErrorMessage ="Mandatory input")]
        int activityID);

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

    public record ActivityCalendarDTORead(int ID, string ActivityName, string? ActivityDescription, DateTime DateStart,
        DateTime DateFinish, List<Member> Members);

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
    public record ActivityDTOInsertUpdate(
        [Required(ErrorMessage = "Mandatory input")] 
        string ActivityName, 
        string? Description,
        [Required(ErrorMessage ="Mandatory input")]
        DateTime DateStart,
        [Required(ErrorMessage ="Mandatory input")]
        DateTime DateFinish, 
        bool? IsFinished, 
        DateTime? DateAccepted,
        [Required(ErrorMessage ="Mandatory input")]
        int ProjectID);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="email"></param>
    /// <param name="password"></param>
    public record MemberDTOAuth(

        [Required(ErrorMessage = "Mandatory input")]
        string Username,
        [Required(ErrorMessage = "Mandatory input")]
        string Password

        );

   public record ProjectDTOKillswitch(

       [Required(ErrorMessage = "Mandatory input")]
       string ProjectName
       );



}