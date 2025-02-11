package tally.example.demo.security;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import com.google.firebase.auth.FirebaseToken;

public class FirebaseAuthenticationToken extends AbstractAuthenticationToken {
    private final FirebaseToken token;

    public FirebaseAuthenticationToken(FirebaseToken token, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.token = token;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return token;
    }

    @Override
    public Object getPrincipal() {
        return token;
    }
} 