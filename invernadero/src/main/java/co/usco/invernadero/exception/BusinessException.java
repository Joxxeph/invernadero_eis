package co.usco.invernadero.exception;

public class BusinessException extends RuntimeException {

    private final String key;

    public BusinessException(String key) {
        super(key);
        this.key = key;
    }

    public String getKey() {
        return key;
    }
}