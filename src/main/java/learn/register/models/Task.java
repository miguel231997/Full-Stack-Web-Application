package learn.register.models;

public class Tasks {

    private Long id;
    private String title;
    private String description;
    private String status;
    private Long userId;

    //getters andd setters

    public Long get(id){
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
