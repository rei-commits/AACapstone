package tally.example.demo.security;

import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

@Component
public class FirebaseAuthUtil {

    public Authentication verifyToken(String token) throws Exception {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        
        return new UsernamePasswordAuthenticationToken(
            decodedToken.getUid(),
            null,
            Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
} 