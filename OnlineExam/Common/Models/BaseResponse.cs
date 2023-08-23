using System.Text.Json.Serialization;

namespace OnlineExam.Common.Models;

public class BaseResponse
{
    [JsonPropertyName("type")]
    public TypeResponse Type { get; set; }
    [JsonPropertyName("data")]
    public object Data { get; set; }
    [JsonPropertyName("error")]
    public ErrorResponse Error { get; set; }
    [JsonPropertyName("errorException")]
    public ErrorResponse ErrorException { get; set; }
}