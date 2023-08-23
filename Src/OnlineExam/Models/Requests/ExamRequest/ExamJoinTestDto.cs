using OnlineExam.Common.Domain;
using OnlineExam.Models.DTOs;

namespace OnlineExam.Models.Requests.ExamRequest;

public class ExamJoinTestDto : BaseDomainDto
{
    public string Name { get; set; }
    public DateTime Start { get; set; }
    public int Time { get; set; }
    public int CountQuestion { get; set; }
    public SubjectDto Subject { get; set; }
    
    
    /*
     *
     * public id?:number;
  public name?:string;
  public subject?:Subject;
  public start?:Date;
  public time?:number;
  public countQuestion?:number;
     */
}